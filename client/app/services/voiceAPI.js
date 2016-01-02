/**
 * Created by oliverwang on 12/19/15.
 */
angular.module('umami.voiceAPI', [])
  .factory('voiceAPI', ['nlp', function (nlp) {
    console.log('factory started')
    var recognizer;
    var stop = false;
    return {
      start: function (recipe) {
        console.log('recipe started', recipe);
        var currentStep = -1;
        var parsing = false;
        var prevLength = 0;
        var instructionKeywords = {
          next: function () {
            return currentStep < recipe.instructions.length ? recipe.instructions[++currentStep] : "You are at the end. Enjoy your meal!";
          },
          previous: function () {
            return currentStep > -1 ? recipe.instructions[--currentStep] : "You are at the beginning.";
          },
          repeat: function () {
            return recipe.instructions[currentStep];
          },
          ingredients:function(){
            return recipe.ingredients.join('.');
          },
          directions:function(){
            return recipe.instructions.join('.');
          },
          help:function(){
            return "you can say directions, ingredients, next, previous, or repeat";
          }
        };


        var u = new SpeechSynthesisUtterance();
        u.rate = .8;
        u.text = '';
        u.lang = 'en-US';

        recognizer = new webkitSpeechRecognition();
        recognizer.continuous = true;
        recognizer.interimResults = true;
        recognizer.lang = "en";

        // Only start speaking when recognizer ends so that it doesn't listen to itself
        recognizer.onend = function () {
          console.log('Recognizer ended');
          speechSynthesis.speak(u);
          prevLength = 0;
        };

        // Start recognizer after computer is finished speaking
        u.onend = function () {
          parsing = false;
          if (!stop) {
            console.log('Done talking!');
            recognizer.start();
          }
        };

        // Recognizer decodes results as they come in
        recognizer.onresult = function (event) {
          var tokens = tokens || {};
          if (event.results.length > 0) {
            var result = event.results[event.resultIndex];

            if (result.isFinal) {
              console.log('Showing text soon', {});

              var inputText = result[0].transcript;
              console.log("You said", inputText);

              handlePhrase(tokenize(inputText, tokens));
            } else {
              var tempTranscript = event.results[0][0].transcript;
              prevLength = prevLength || 0;

              if (tempTranscript.length > 50 && !parsing) {
                parsing = true;
                console.log('Short circuit recognizer due to long command', tempTranscript);

                handlePhrase(tokenize(tempTranscript, tokens));
              } else if (!parsing) {
                handlePhrase(tokenize(tempTranscript.slice(prevLength), tokens));
                prevLength = tempTranscript.length;
              }
            }
          }
        };

        function tokenize(inputText, existingTokens) {
          var tokenizedPhrase = nlp.tokenize(inputText);
          var tokens = tokenizedPhrase[0].tokens.reduce((agg, next) => {
            console.log(agg)
            if (next && agg[next.text]) {
              agg[next.text]++;
            } else {
              agg[next.text] = 1;
            }

            return agg;
          }, existingTokens);

          return tokens;
        }

        var startRecord = function () {
          console.log('Starting record');
          stop = false;
          recognizer.start();
        };

        var stopRecord = function () {
          console.log('Stopping record');
          stop = true;
          recognizer.stop();
        };

        function getIngredients() {
          return recipe.ingredients.map(item => item.split(' '));
        }

        /**
         wantsAllIngredients - check if a user wants the list of ingredients

         @param  {string}  phrase      Input phrase
         @return {boolean }            True if user wants the list of all ingredients
         False otherwise
         */
        function wantsAllIngredients(phrase) {
          var s = nlp.pos(phrase).sentences[0];
          var nounsFound = s.nouns().map(getText);
          return (nounsFound.indexOf('ingredients') !== -1);
        };

        /**
         wantsOneIngredient - check if a user wants any of the ingredients in recipe

         @param {string} phrase    Input phrase
         @return {boolean}         True, if user input has ingredient that's in the recipe
         False, otherwise
         */
        function wantsOneIngredient(phrase) {
          var ingredients = getIngredients();
          for (var k = 0; k < ingredients.length; k++) {
            var items = ingredients[k];
            for (var i = 0, len = items.length; i < len; i++) {
              var word = items[i];
              if (word in phrase) {
                return items;
              }
            }
          }
          // Recipe contains no ingredients uttered in phrase
          return false;
        }

        function handlePhrase(tokens) {
          Object.keys(instructionKeywords).forEach(item => {
            if (item in tokens) {
              console.log('Found instruction in tokens');
              u.text = instructionKeywords[item]();
              console.log('Instruction:', u.text);
              recognizer.stop();
            } else {
              var foundIngredient = wantsOneIngredient(tokens);
              if (foundIngredient) {
                console.log('Found request for ingredient in tokens');
                console.log('ingredient:', foundIngredient);
                u.text = 'You need ' + foundIngredient.join(' ');
                recognizer.stop();
              }
            }
          });
        }

        return {
          startRecord,
          stopRecord
        }

      },
      stop: function () {
        if (recognizer) {
          recognizer.stop();
        }
      }
    }
  }]);
