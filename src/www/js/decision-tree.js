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

define(['records', 'utils', 'file', 'widgets', './ext/eo-graph'], function(records, utils, file, widgets, EOGraph) { // jshint ignore:line
    var dgroup, dtype;
    var eoGraph;
    var asAForm = false; // Flag to ignore the records.EVT_EDIT_ANNOTATION event

    var onFinishDtree;

    var pluginRoot = 'plugins/decision-tree/';

    var dtreeId = 'fieldcontain-dtree-1';

    var fieldsetWidget = _.template(
        '<fieldset data-role="controlgroup" data-theme="b">' +
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
        '<% } else { %>' +
        '<a href="#" id="dtree-done" data-role="button" data-mini="true" data-inline="true">Done.</a>' +
        '<% } %>'
    );

    var inputValue = _.template(
        '<div>' +
            '<div class="dtree-value">' +
                '<input type="text" ' +
                       'id="dtree-value"' +
                       'value="<%= value %>" ' +
                       'data-dtree-value="<%= dtree %>" ' +
                       'readonly >' +
            '</div>' +
            '<div class="dtree-delete">' +
                '<a href="#" data-role="button" ' +
                            'data-iconpos="notext" ' +
                            'data-icon="delete"></a>' +
            '</div>' +
        '</div>'
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

    var getReprAndValue = function(graph) {
        var repr;
        var value;

        value = graph.edges().map(formatEdge);
        repr = graph.values().join(', ');

        return {
            repr: repr,
            value: value
        };
    };

    var addRecordTreeAnswers = function(e, annotation) {
        var field;
        var graph;

        field = {
            id: dtreeId,
            label: 'Decision tree'
        };

        if (eoGraph !== undefined && asAForm) {
            graph = getReprAndValue(eoGraph);
            field.repr = graph.repr;
            field.val = [graph.repr];

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

        // Move this to a better place
        toggleLongButtons(buttons);

        return fieldsetWidget({
            question: node.label,
            fields: renderFieldsToString(node.name, node.edges),
            buttons: ''
            // buttons: controlButtons(buttons)
        });
    };

    var renderPage = function() {
        var node;
        var html;
        console.debug('render');

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
    var loadDtree = function(group, type, callback) {
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
                    else {
                        utils.doCallback(callback);
                    }
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

    var insertPopupPlaceHolder = function() {
        var $form = $('form');
        var html = '<div id="dtree-container" data-role="popup" data-dismissible="false">' +
                       '<div id="dtree-long-prev">' +
                       '<div class="triangle-left"></div>' +
                       '</div>' +
                       '<div id="dtree-form-wrapper">' +
                           '<form id="dtree-form" data-ajax="false" accept-charset="utf-8"></form>' +
                       '</div>' +
                       '<div id="dtree-long-next">' +
                       '<div class="triangle-right"></div>' +
                       '</div>' +
                   '</div>';

        $form.append(html);
        $('#dtree-container').popup();
    };

    var registerOnFinish = function(func) {
        onFinishDtree = func;
    };

    records.addDisplayEditorFunction(insertPopupPlaceHolder);

    var toggleLongButtons = function(buttons) {
        var triangleLeft = '#dtree-long-prev > .triangle-left';
        var triangleRight = '#dtree-long-next > .triangle-right';

        if (buttons.previous) {
            $(triangleLeft).removeClass('inactive');
        }
        else {
            $(triangleLeft).addClass('inactive');
        }
        if (buttons.next) {
            $(triangleRight).removeClass('inactive');
        }
        else {
            $(triangleRight).addClass('inactive');
        }
    };

    var doNext = function(event) {
        event.stopPropagation();
        event.preventDefault();

        var answers = $('form#dtree-form').serializeArray();
        if (answers.length === 1) {
            eoGraph.next(answers[0].value);
            if (eoGraph.hasNext()) {
                renderPage();
            }
            else {
                utils.doCallback(onFinishDtree);
            }
        }
        else {
            popup('Please answer all the questions');
        }
        return false;
    };

    var doPrev = function(event) {
        event.stopPropagation();
        event.preventDefault();

        eoGraph.previous();
        renderPage();

        return false;
    };

    /*********EVENTS************/
    $(document).on('vclick', '#dtree-prev', doPrev);
    $(document).on('vclick', '#dtree-next', doNext);

    $(document).on('vclick', '#dtree-long-prev', doPrev);
    $(document).on('vclick', '#dtree-long-next', doNext);

    $(document).off('vclick', '#dtree-done');
    $(document).on(
        'vclick',
        '#dtree-done',
        function(event) {
            event.stopPropagation();
            event.preventDefault();

            utils.doCallback(onFinishDtree);

            return false;
        }
    );

    // Dtree from a button inside an editor
    $('body').off('vclick', '.annotate-dtree');
    $('body').on('vclick', '.annotate-dtree', function(event) {
        var fieldcontain = $(event.target).closest('.fieldcontain').get(0);
        var group = localStorage.getItem('annotate-form-group');
        var type = localStorage.getItem('annotate-form-type');
        var $fieldcontain = $(fieldcontain);

        if (fieldcontain && fieldcontain.id) {
            dtreeId = fieldcontain.id;
        }

        loadDtree(group, type, function() {
            $('#dtree-container').popup('open');

            registerOnFinish(function(event) {
                var graph;
                var html;
                var value;
                var dtree;
                var label;

                graph = getReprAndValue(eoGraph);
                value = graph.repr;
                dtree = JSON.stringify(graph.value);
                label = $fieldcontain
                            .find('label[for="' + fieldcontain.id + '"]')
                            .text();

                html = inputValue({
                    label: label,
                    value: value,
                    dtree: dtree
                });

                $(html)
                    .insertBefore('.button-dtree', fieldcontain)
                    .trigger('create');

                $('#dtree-container').popup('close');

                return false;
            });

            renderPage();
        });

    });

    $(document).off('vclick', '.dtree-delete');
    $(document).on('vclick', '.dtree-delete', function(event) {
        var $target = $(event.currentTarget);
        $target.parent().remove();
    });

    // Dtree from the the capture page
    $('body').off('click', '.annotate-dtree-form');
    $('body').on('click', '.annotate-dtree-form', function(event) {
        var $editor = $(event.currentTarget);
        var group = $editor.attr('data-editor-group');
        var type = $editor.attr('data-editor-type');

        group = group || records.EDITOR_GROUP.DEFAULT;
        asAForm = true;

        loadDtree(group, type, function() {
            $('body').pagecontainer('change', 'decision-tree.html', {transition: 'fade'});

            registerOnFinish(function() {
                records.annotate(dgroup, dtype);
            });
        });
    });

    // TODO: do this in a more clean and modular way
    // Self register as a widget

    (function() {
        var WIDGET_NAME = 'dtree';

        var initialize = function(index, element) {
            var $el = $(element);

            $.each($('.button-dtree', element), function(index, input) {

                var btn = '<a class="annotate-dtree" data-role="button" href="#">' +
                              'Add ' +
                          '</a>';

                $(input)
                    .append(btn)
                    .trigger('create');
            });
        };

        var validate = function(html) {
            return {
                valid: true,
                errors: []
            };
        };

        var serialize = function(element) {
            var $el = $(element);
            var values = [];
            var label;

            $el.find('input[data-dtree-value]').each(function(i, item) {
                values.push(item.value);
            });

            label = $el.find('label[for="' + element.id + '"]').text();

            return {
                serialize: true,
                label: label,
                value: values,
                repr: JSON.stringify(values)
            };
        };

        widgets.registerWidget({
            name: WIDGET_NAME,
            initialize: initialize,
            validate: validate,
            serialize: serialize
        });
    })();

    // listen on any page with class sync-page
    $(document).on('_pageshow', '#decision-tree-page', renderPage);
    $(document).on(records.EVT_EDIT_ANNOTATION, addRecordTreeAnswers);

    $('head').prepend('<link rel="stylesheet" href="plugins/decision-tree/css/style.css" type="text/css" />');
});
