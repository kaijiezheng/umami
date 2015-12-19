angular.module('umami.recipe', ['ngRoute'])

  .controller('RecipeController', ['$scope', 'searchResult', 'nlp','$routeParams', function ($scope, searchResult, nlp, $routeParams) {
    var currentStep = 0;
    $scope.params = $routeParams;
    var instructionKeywords={
      next:function(){
        return currentStep < $scope.recipe.instructions.length ? $scope.recipe.instructions[++currentStep] : "you are at the end";
      },
      previous:function(){
        return currentStep > 0 ?$scope.recipe.instructions[--currentStep] : "you are at the beginning";
      },
      repeat: function () {
        return $scope.recipe.instructions[currentStep]
      }
    };
    var parsing = false;
    var recipeId = $routeParams.recipeId || '5160d4f896cc620d188cb475';
    var recipe;
    searchResult.getRecipe(recipeId)
      .then(function (response){
        recipe = response.data[0]._source;
        console.log("recipe = ", recipe);
        recipe.instructions = recipe.instructions.filter(item=> item.length>3);
        $scope.recipe = recipe;
      });

    //console.log(recipe);
    var prevLength;

    // test text-to-speech
    var u = new SpeechSynthesisUtterance();
    u.rate = .8;
    u.text = 'Lets have some tea';
    u.lang = 'en-UK';
    //u.voice = window.speechSynthesis.getVoices()[16];
    //speechSynthesis.speak(u);
    //console.log("getIngredients() = ", getIngredients());
    var recognizer = new webkitSpeechRecognition();
    recognizer.continuous = true;
    recognizer.interimResults = true;
    recognizer.lang = "en";
    recognizer.onend = function (){
      speechSynthesis.speak(u);
      prevLength = 0;
      console.log('ended')
    };
    u.onend = function () {
      console.log('i"m done talking!')
      parsing = false;
      recognizer.start();
    };
    recognizer.onresult = function (event) {
      if (event.results.length > 0) {
        var result = event.results[event.resultIndex];
        if (result.isFinal) {
          console.log('showing text ... soon'); // check progress
          var inputText = result[0].transcript;
          console.log("you said", inputText);   // check speech-to-text result
          handlePhrase(tokenize(inputText));
        } else {
          var tokens = tokens || {};
          prevLength = prevLength || 0;
          var tempTranscript = event.results[0][0].transcript;
          if(tempTranscript.length > 50 && !parsing){
            parsing = true;
            console.log(tempTranscript);

            handlePhrase(tokenize(tempTranscript, tokens));
          } else if(!parsing){
            handlePhrase(tokenize(tempTranscript.slice(prevLength), tokens))
            prevLength = tempTranscript.length;
          }
          //console.log(event.result[event.result.length-1][0].transcript)
        }

      }
    };


    function tokenize(inputText, existingTokens) {
      existingTokens = existingTokens || {};
      var tokenizedPhrase = nlp.tokenize(inputText);
      var tokens = tokenizedPhrase[0].tokens.reduce((agg, next) => {
          if(agg[next.text]){
        agg[next.text]++;
      }else{
        agg[next.text] = 1;
      }
      return agg;
    }, existingTokens);
      return tokens;
    }

    $scope.startRecord= function() {
      console.log('starting Record');
      recognizer.start();
    };
    $scope.stopRecord= function() {
      console.log('starting Record');
      recognizer.stop();
    };



    function getIngredients() {
      return $scope.recipe.ingredients.map(item => item.split(' '));
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
        var item = ingredients[k];
        for (var i = 0, len = item.length; i < len; i++) {
          var word = item[i];
          if (isWordFound(phrase, word)) return item;
        }
      }
      return false;  // recipe contains no ingredients uttered in phrase
    }

    function handlePhrase(tokens){
      console.log(tokens)
      Object.keys(instructionKeywords).forEach(item => {
        if (item in tokens){
        u.text = instructionKeywords[item]();
        console.log(u.text)
        recognizer.stop();
      } else {
        var foundIngredient = wantsOneIngredient(tokens);
        if (foundIngredient) {
          console.log('ingredient = ' + foundIngredient);  // simple check
          u.text = 'The ingredients are ' + foundIngredient.join(' ');
          recognizer.stop();
        }
      }
    })
    }




    /**
     =======================================
     Helper functions
     =======================================
     */

    function isWordFound(tokenizedPhrase, word) {
      return (word in tokenizedPhrase);
    }


  }]);
