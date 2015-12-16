angular.module('umami.recipe', ['ngRoute'])

  .controller('RecipeController', ['$scope', 'searchResult', 'nlp', function ($scope, searchResult, nlp) {
    var currentStep = 0;
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

    var recipe = searchResult.getStorage() || {
      "id": "5160d4f896cc620d188cb475",
      "name": "Lemon and Fresh Herb Tabbouleh",
      "source": "epicurious",
      "url": "http://www.epicurious.com/recipes/food/views/Lemon-and-Fresh-Herb-Tabbouleh-355892",
      "recipeYield": "Makes 8 servings",
      "ingredients": ["1/2 cup medium- or fine-grain bulgur", "2 tablespoons extra virgin olive oil", "2 garlic cloves, minced", "2 cups finely chopped fresh flat-leaf parsley (about 3 bunches)", "3/4 cup diced red onion", "2 medium tomatoes, seeded and diced", "1/3 cup finely chopped fresh mint", "1/4 cup finely chopped fresh basil", "3 tablespoons finely chopped fresh dill", "3 tablespoons finely chopped fresh cilantro", "1/3 cup fresh lemon juice"],
      "datePublished": "2009-03-01",
      "description": null,
      "image": "http://assets.epicurious.com/photos/5609a75e62fa7a9917c25aa0/master/pass/355892.jpg",
      "instructions": ["Bring a kettle of water to a boil.", "Stir together the bulgur and 1 tablespoon of the oil in a heatproof bowl.", "Add boiling water to cover.", "Cover the bowl tightly with plastic wrap and let stand for 15 minutes.", "Drain in a sieve, pressing on the bulgur to remove any excess liquid.", "Transfer the bulgur to a large bowl and toss with the remaining 1 tablespoon oil and the rest of the ingredients until everything is well mixed.", "Cover and refrigerate for at least 3 hours.", "Serve cold."]
    };
    recipe.instructions = recipe.instructions.filter(item=> item.length>3)
    $scope.recipe = recipe;

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
