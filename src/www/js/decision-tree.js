/*
Copyright (c) 2014, EDINA.
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice, this
   list of conditions and the following disclaimer in the documentation and/or
   other materials provided with the distribution.
3. All advertising materials mentioning features or use of this software must
   display the following acknowledgement: This product includes software
   developed by the EDINA.
4. Neither the name of the EDINA nor the names of its contributors may be used to
   endorse or promote products derived from this software without specific prior
   written permission.

THIS SOFTWARE IS PROVIDED BY EDINA ''AS IS'' AND ANY EXPRESS OR IMPLIED
WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
SHALL EDINA BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
DAMAGE.
*/

'use strict';

/* global _ */

define(['records', 'utils', 'file', './ext/eo-graph'], function(records, utils, file, EOGraph) {
    var dgroup, dtype;
    var eoGraph;

    var pluginRoot = 'plugins/decision-tree/';

    var dtreeId = 'fieldcontain-dtree-1';

    var fieldsetWidget = _.template(
        '<fieldset data-role="controlgroup">' +
            '<legend><%- question %></legend>' +
            '<%= fields %>' +
        '</fieldset>' +
        '<%= buttons %>'
    );

    var radioWidget = _.template(
        '<label for="radio-<%- id %>"><%- label %></label>' +
        '<input ' +
            'name="<%= name %>" ' +
            'id="radio-<%= id %>" ' +
            'value="<%= value %>" ' +
            'type="radio" ' +
            '<% if (required === true) { %>required="required"<% } %> ' +
            '<% if (checked === true) { %>checked="checked"<% } %> ' +
        '>'
    );

    var rangeWidget = _.template(
        '<label for="slider-<%- id %>">Input slider:</label>' +
        '<input type="range" name="<%= name %>" id="slider-<%- id %>" value="<%- value %>" min="<%- min %>" max="<%- max %>">'
    );

    var controlButtons = _.template(
        '<% if (previous === true) { %>' +
        '<a href="#" id="dtree-prev" data-role="button" data-mini="true" data-inline="true"><< Prev</a>' +
        '<% } %>' +
        '<% if (next === true) { %>' +
        '<a href="#" id="dtree-next" data-role="button" data-mini="true" data-inline="true">Next >></a>' +
        '<% } %>'
    );

    var formatEdge = function(edge) {
        return {
            id: edge.nodeId,
            answer: {
                value: edge.value,
                id: edge.edgeId
            }
        };
    };

    var addRecordTreeAnswers = function(e, annotation) {
        var field;

        field = {
            id: dtreeId,
            label: 'Decision tree'
        };

        if (eoGraph !== undefined) {
            field.dtree = eoGraph.edges().map(formatEdge);
            field.val = eoGraph.values().join(', ');

            annotation.record.properties.fields.push(field);
        }
    };

    var renderFieldsToString = function(name, edges) {
        var elementType;
        var fields = '';
        var edge;
        edges = edges || [];

        for (var i = 0, len = edges.length; i < len; i++) {
            edge = edges[i];
            if (edge.element) {
                elementType = edge.element.type;
            }
            else {
                elementType = 'radio';
            }

            switch (elementType) {
                case 'slider':
                    fields += rangeWidget({
                        id: i,
                        name: name,
                        label: edge.label,
                        min: edge.element.options.min,
                        max: edge.element.options.max,
                        value: edge.element.options.value
                    });
                break;
                default:
                    fields += radioWidget({
                        id: i,
                        name: name,
                        label: edge.label,
                        required: false,
                        checked: false,
                        value: edge.value
                    });
            }
        }

        return fields;
    };

    var renderFieldSetToString = function(node) {
        var buttons = {
            previous: eoGraph.hasPrevious(),
            next: eoGraph.hasNext()
        };

        return fieldsetWidget({
            question: node.label,
            fields: renderFieldsToString(node.name, node.edges),
            buttons: controlButtons(buttons)

        });
    };

    var renderPage = function() {
        var node;
        var html;

        node = eoGraph.current();

        html = renderFieldSetToString(node);
        $('#dtree-form')
            .html(html)
            .parent()
            .trigger('create');
    };

    /* popup a msg */
    var popup = function(msg) {
        $('#popup-text').html(msg);
        $('#dtree-popup').popup('open');
    };

    /**
     * function for initializing DecisionTree
     * download data and start questionnaire
     */
    var initDtree = function(group, type) {
        var url;

        if (group ===  records.EDITOR_GROUP.DEFAULT) {
            url = 'editors/' + type.replace(/.edtr$/, '.json');
        }
        else {
            url = file.getFilePath(records.getEditorsDir(group)) + '/' + type.replace(/.edtr$/, '.json');
        }
        dgroup = group;
        dtype = type;

        $.ajax({
            url: url,
            dataType: 'json',
            success: function(data) {
                $.mobile.loading('hide');
                console.debug(data);
                eoGraph = new EOGraph();
                if (data) {
                    if (!eoGraph.init(data)) {
                        utils.informError('Error loading the tree');
                    }

                    $('body').pagecontainer('change', 'decision-tree.html', {transition: 'fade'});
                }
                else {
                    utils.informError('No data ');
                }
            }
        });
    };

    /**
     * Implements the records.processEditor interface
     * @param editorName name of the editor
     * @param html html content of the editor
     * @param group from records.EDITOR_GROUP
     * @param online boolean value if the processing is held online
     */
    var processEditor = function(editorName, html, group, online) {
        var $form = $(html);
        var editorsObj = records.loadEditorsMetadata();

        // Add the dom class that will be used in the buttons
        var editorClass = $('#dtree-form-class-name', $form).text();
        if (editorClass !== '') {
            if (editorsObj[group][editorName] === undefined) {
                editorsObj[group][editorName] = {};
            }

            editorsObj[group][editorName]['class'] = editorClass;

            // Save the result
            records.saveEditorsMetadata(editorsObj);
        }
    };

    // Add the plugin editor process to the pipeline
    records.addProcessEditor(processEditor);

    var createButton = function() {
        $.each($('.button-dtree'), function(index, input) {
            var btn = '<div id="annotate-dtree-' + index + '">' +
                          '<a class="annotate-dtree" href="#">' +
                              '<img src="' + pluginRoot + 'css/images/eo.png">' +
                          '</a>' +
                      '</div>';
            $(input).append(btn);
        });
    };

    records.addDisplayEditorFunction(createButton);

    /*********EVENTS************/
    $(document).on(
        'vclick',
        '#dtree-prev',
        function(event) {
            event.stopPropagation();
            event.preventDefault();

            eoGraph.previous();
            renderPage();

            return false;
        }
    );
    $(document).on(
        'vclick',
        '#dtree-next',
        function(event) {
            event.stopPropagation();
            event.preventDefault();

            var answers = $('form').serializeArray();
            if (answers.length === 1) {
                eoGraph.next(answers[0].value);
                if (eoGraph.hasNext()) {
                    renderPage();
                }
                else {
                    records.annotate(dgroup, dtype);
                }
            }
            else {
                popup('Please answer all the questions');
            }
            return false;
        }
    );

    // Dtree from a button inside an editor
    $('.annotate-dtree').unbind();
    $('body').on('click', '.annotate-dtree', function(event) {
        var fieldcontain = $(event.target).closest('.fieldcontain').get(0);
        var group = localStorage.getItem('annotate-form-group');
        var type = localStorage.getItem('annotate-form-type');

        if (fieldcontain && fieldcontain.id) {
            dtreeId = fieldcontain.id;
        }

        initDtree(group, type);
    });

    // Dtree from the the capture page
    $('.annotate-dtree-form').unbind();
    $('body').on('click', '.annotate-dtree-form', function(event) {
        var $editor = $(event.currentTarget);
        var group = $editor.attr('data-editor-group');
        var type = $editor.attr('data-editor-type');

        group = group || records.EDITOR_GROUP.DEFAULT;

        initDtree(group, type);
    });

    // listen on any page with class sync-page
    $(document).on('_pageshow', '#decision-tree-page', renderPage);
    $(document).on(records.EVT_EDIT_ANNOTATION, addRecordTreeAnswers);

    $('head').prepend('<link rel="stylesheet" href="plugins/decision-tree/css/style.css" type="text/css" />');
});
