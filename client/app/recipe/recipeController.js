angular.module('umami.recipe', ['ngRoute'])
.controller('RecipeController', ['$scope', 'searchResult', 'nlp', '$routeParams', function ($scope, searchResult, nlp, $routeParams) {
  var currentStep = -1;
  var parsing = false;
  var prevLength = 0;
  var recipeId = $routeParams.recipeId || '5160d4f896cc620d188cb475';

  var BACKUP_RECIPE = {
    "id": "5160d4f896cc620d188cb475", //?api/recipe/5160d4f896cc620d188cb475
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

  var instructionKeywords = {
    next: function() {
      return currentStep < $scope.recipe.instructions.length ? $scope.recipe.instructions[++currentStep] : "You are at the end. Enjoy your meal!";
    },
    previous: function() {
      return currentStep > -1 ? $scope.recipe.instructions[--currentStep] : "You are at the beginning.";
    },
    repeat: function() {
      return $scope.recipe.instructions[currentStep];
    }
  };

  $scope.recipe = {};
  $scope.params = $routeParams;

  searchResult.getRecipe(recipeId)
    .then(function(response) {
      if (response) {
        $scope.recipe = response.data[0]._source;
        console.log("Recipe:", $scope.recipe);
        $scope.recipe.instructions = $scope.recipe.instructions.filter(item => item.length > 4);
        $scope.recipe = recipe;
      } else {
        $scope.recipe = BACKUP_RECIPE;
      }
    });

  var u = new SpeechSynthesisUtterance();
  u.rate = .8;
  u.text = 'Lets have some tea';
  u.lang = 'en-UK';
  //speechSynthesis.speak(u);

  var recognizer = new webkitSpeechRecognition();
  recognizer.continuous = true;
  recognizer.interimResults = true;
  recognizer.lang = "en";

  // Only start speaking when recognizer ends so that it doesn't listen to itself
  recognizer.onend = function() {
    speechSynthesis.speak(u);
    prevLength = 0;
    console.log('Recognizer ended');
  };

  // Start recognizer after computer is finished speaking
  u.onend = function () {
    parsing = false;
    recognizer.start();
    console.log('Done talking!');
  };

  // Recognizer decodes results as they come in
  recognizer.onresult = function (event) {
    if (event.results.length > 0) {
      var result = event.results[event.resultIndex];

      if (result.isFinal) {
        console.log('Showing text soon');

        var inputText = result[0].transcript;
        console.log("You said", inputText);

        handlePhrase(tokenize(inputText));
      } else {
        var tokens = tokens || {};
        var tempTranscript = event.results[0][0].transcript;
        prevLength = prevLength || 0;

        if (tempTranscript.length > 50 && !parsing){
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
      if (agg[next.text]) {
        agg[next.text]++;
      } else {
        agg[next.text] = 1;
      }

      return agg;
    }, existingTokens);

    return tokens;
  }

  $scope.startRecord = function() {
    console.log('Starting record');
    recognizer.start();
  };

  $scope.stopRecord = function() {
    console.log('Stopping record');
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

  /**
   =======================================
   Helper functions
   =======================================
   */

}]);
