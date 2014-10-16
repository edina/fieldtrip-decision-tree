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

define(['./data2'], function(tree){
    //the first page
    var page = "root";
    //the object of the current question
    var questionObj;
    //an array of all the answers
    var answers = [];
    //the number of times that previous button is pressed, need restriction
    var previous = 0;

    var createQuestion = function(q, choice){
        if(q){
            $('#dtree-form').html(createQuestionOptions(q, choice).join("")).parent().trigger('create');
        }
    };

    var createQuestionOptions = function(obj, choice){
        var fieldset;
        if(obj.children instanceof Array) {
            fieldset = ['<fieldset data-role="controlgroup">'];
            fieldset.push('<legend>' + obj.name + '</legend>');
            $.each(obj.children, function(i,v){
                var id;
                if(v[1] !== null){
                    fieldset.push('<label for="'+v[1]+'">' + v[0] + '</label>');
                    id = v[1];
                    if(choice && choice === v[0]){
                        fieldset.push('<input name="radio-' + page + '" id="' + id + '" value="' + v[0] + '" type="radio" required="" checked="checked">');
                    }
                    else{
                        fieldset.push('<input name="radio-' + page + '" id="' + id + '" value="' + v[0] + '" type="radio" required="">');
                    }
                }
                else{
                    fieldset.push('<label for="'+v[0]+'">' + v[0] + '</label>');
                    id = v[0];
                    if(choice && choice === v[0]){
                        fieldset.push('<input name="radio-' + page + '" id="' + id + '" value="' + v[0] + '" type="radio" required="" checked="checked">');
                    }
                    else{
                        fieldset.push('<input name="radio-' + page + '" id="' + id + '" value="' + v[0] + '" type="radio" required="">');
                    }
                }
            });
            fieldset.push('</div>');
        }
        else if(obj.children === 'integer'){
            fieldset = ['<label for="'+ page +'">'+obj.name+'</label>'];
            fieldset.push('<input type="number" id="'+page+'" value="0">');
        }
        return fieldset;
    };

    /**
     * Checks that i) something is selected ii) answer is implemented
     *  and shows relevant message.
     * Returns true/false to indicate correct/incorrect result
     */
    var checkAnswer = function(){
        var selected = getSelection();
        var answer = tree.questions[page].children;
        if (! selected ){ //no selection made
            popup("Please choose a class");
            return false;
        }
        return true;
    };

    var checkAnswerInAnswers = function(back){
        var value;
        var changed = false;
        for(var i=answers.length-1; i>=0;i--){
            if(answers[i].id === page){
                if(back){
                    page = answers[i-1].id;
                    value = answers[i-1].answer.value;
                }
                else{
                    page = answers[i].id;
                    value = answers[i].answer.value;
                }
                changed = true;
                break;
            }
        }
        if(!changed && answers.length > 0 && back){
            page = answers[answers.length-1].id;
            value = answers[answers.length-1].answer.value;
        }
        return value;
    };

    var findNextQuestion = function(answer){
        if("leadsTo" in questionObj){
            var leadsTo = questionObj.leadsTo;
            if(leadsTo instanceof Array){
                page = questionObj.leadsTo;
                for(var i=0; i<answers.length; i++){
                    for(var j=0; j<page.length; j++){
                        if(page[j].indexOf("-") && answers[i].answer.id.split("-")[0] === page[j]){
                            page = answers[i].answer.id.split("-")[0];
                        }
                        else if(answers[i].answer.id === page[j]){
                            page = answers[i].answer.id;
                        }
                    }
                }
            }
            else{
                page = questionObj.leadsTo;
            }
        }
        else{
            page = answer.id;
        }
    };

    /** Returns selected value or null if none selected */
    var getSelection = function(){
        var selected;
        if(tree.questions[page].children instanceof Array){
            selected = {
                "value": $('input[name="radio-' + page + '"]:checked', '#dtree-form').val(),
                "id": $('input[name="radio-' + page + '"]:checked', '#dtree-form').prop('id')
            };
        }
        else{
            selected = {
                "value": $('input').val(),
                "id": page
            };
        }
        if(selected.value === undefined){
            return null;
        }
        else{
            return selected;
        }
    };

    /**
     * function for getting the question from data
     * @param key: the id of the question
     * @returns: the question object
     */
    var getQuestion = function(key){
        for(var q in tree.questions){
            if(q === key){
                return tree.questions[q];
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
            previous++;
            var value = checkAnswerInAnswers(true);
            createQuestion(tree.questions[page], value);
            setQuestion(tree.questions[page]);
        }
    );
    $(document).on(
        'vclick',
        '#dtree-next',
        function(){
            //check if answer is selected
            if(!checkAnswer()){
                $("#dtree-popup").popup('open');
                return;
            }
            var answer = getSelection();
            
            var check =false;
            for(var i=0; i<answers.length;i++){
                if(answers[i].id === page){
                    if(answer.value !== answers[i].answer.value){
                        answers[i].answer = answer;
                    }
                    check = true;
                    break;
                }
            }
            if(check === false){
                //store the answer in an array
                answers.push({"id": page, "answer": answer});
            }
            findNextQuestion(answer);
            //get answer for the question if already exists
            var value = checkAnswerInAnswers();

            createQuestion(tree.questions[page], value);
            setQuestion(tree.questions[page]);
        }
    );

    // listen on any page with class sync-page
    $(document).on('_pageshow', '#decision-tree-page', initQuestionnaire);

    $('head').prepend('<link rel="stylesheet" href="plugins/sync/css/style.css" type="text/css" />');
});
