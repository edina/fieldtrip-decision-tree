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

"use strict";

/* jshint multistr: true */

define(['./data'], function(tree){
    var page = 0;

    var createQuestion = function(obj){
        var fieldset = ['<fieldset data-role="controlgroup">'];
        fieldset.push('<legend>' + obj.name + '</legend>');
        $.each(obj.children, function(i,v){
            fieldset.push('<label for="form-radio1-1">Radio</label>');
            fieldset.push('<input name="form-radio1" id="form-radio1-1" value="Radio" type="radio" required="">');
        });
    };

    /** Checks that i) something is selected ii) answer is implemented
     *  and shows relevant message.
     * Returns true/false to indicate correct/incorrect result
     */
    var checkAnswer = function(){
        var selected = getSelection();
        var answer = tree[page].answer;
        if (! selected ){ //no selection made
            popup("Please choose a class");
            return false;
        }
        if ( selected != answer ){ //unimplemented selection made
            popup("Only " + answer + " is implemented. Your choice was: " + selected );
            return false;
        }
        return true;
    };

    /** Returns selected value or null if none selected */
    var getSelection = function(){
        var name =  tree[page].legend; //for demo purposes
        var selected = $('input[name="' + name + '"]:checked', '#biosos-form').val();
        return selected || null;
    };

    var getStartingQuestion = function(){
        for(var i=0; i<tree.length; i++){
            if(tree[i].parent === null){
                return tree[i];
            }
        }
        return undefined;
    };

    /**
     * function for initializing the questionnaire
     */
    var initQuestionnaire = function(){
        var q = getStartingQuestion();
        if(q){
            $("#dtree-form").html(q.name);
        }
    };

     /* popup a msg */
    var popup = function(msg){
        $('#popup-text').text(msg).parent().popup('open');
    };

    /*********EVENTS************/
    $(document).on(
        'vclick',
        '#dtree-prev',
        function(event){
            
        }
    );
    $(document).on(
        'vclick',
        '#dtree-next',
        function(){
            
        }
    );

    // listen on any page with class sync-page
    $(document).on('_pageshow', '#decision-tree-page', initQuestionnaire);

    $('head').prepend('<link rel="stylesheet" href="plugins/sync/css/style.css" type="text/css" />');
});
