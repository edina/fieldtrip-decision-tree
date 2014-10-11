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
    var questionObj;
    var answers = [];

    var createQuestion = function(q){
        if(q){
            $('#dtree-form').html(createQuestionOptions(q).join("")).parent().trigger('create');
        }
    };

    var createQuestionOptions = function(obj){
        var fieldset = ['<fieldset data-role="controlgroup">'];
        fieldset.push('<legend>' + obj.name + '</legend>');
        $.each(obj.children, function(i,v){
            if(v instanceof Array){
                fieldset.push('<label for="'+v[1]+'">' + v[0] + '</label>');
                fieldset.push('<input name="radio-' + obj.id + '" id="' + v[1] + '" value="' + v[0] + '" type="radio" required="">');
            }
            else{
                fieldset.push('<label for="'+v+'">' + v + '</label>');
                fieldset.push('<input name="radio-' + obj.id + '" id="' + v + '" value="' + v + '" type="radio" required="">');
            }
        });
        fieldset.push('</div>');
        return fieldset;
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
        var selected = {
            "value": $('input[name="radio-' + tree[page].id + '"]:checked', '#dtree-form').val(),
            "id": $('input[name="radio-' + tree[page].id + '"]:checked', '#dtree-form').prop('id')
        };
        return selected || null;
    };

    /**
     * function for getting the question from data
     * @param key: the id of the question
     * @returns: the question object
     */
    var getQuestion = function(key){
        for(var i=0; i<tree.length; i++){
            if(tree[i].id === key){
                return tree[i];
            }
        }
        return;
    };

    /**
     * function for initializing the questionnaire
     */
    var initQuestionnaire = function(){
        var q = getQuestion('root');
        if(q){
            setQuestion(q);
            createQuestion(q);
        }
    };

     /* popup a msg */
    var popup = function(msg){
        $('#popup-text').text(msg).parent().popup('open');
    };

    var setQuestion = function(q){
        questionObj = q;
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
            //if(checkAnswer() && page >= tree.length - 1){
            //    $("#dtree-popup").popup('open');
            //    return;
            //}
            var answer = getSelection();
            console.log(answer)
            //store the answer in an array
            answers.push({"id": questionObj.id, "answer": answer, "hasChildren": (questionObj.children[0] instanceof Array)});
            page++;
            console.log(tree[page])
            if(questionObj.parent === tree[page].parent){
                createQuestion(tree[page]);
            }
            else{
                for(var i=answers.length; i>0; i--){
                    if(answers[i].hasChildren && answers[i].answer.id === answers[i].id){
                        
                    }
                }
                createQuestion(tree[page]);
            }
        }
    );

    // listen on any page with class sync-page
    $(document).on('_pageshow', '#decision-tree-page', initQuestionnaire);

    $('head').prepend('<link rel="stylesheet" href="plugins/sync/css/style.css" type="text/css" />');
});
