angular.module('umami.recipe', ['ngRoute'])

.controller('RecipeController',['$scope','searchResult','nlp', function ($scope, searchResult,nlp) {
  // Your code here
  $scope.hello = "hello umami";
  //var recipe = searchResult.getStorage();
  var recipe = {
    "id": "5160757596cc6207aada322f",
    "name": "Spinach and Kamut Salad with Chili-Orange Dressing",
    "source": "naturallyella",
    "url": "http://naturallyella.com/2013/03/18/spinach-and-kamut-salad-with-chili-orange-dressing/",
    "recipeYield": "2",
    "ingredients": ["3-4 handfuls spinach", "½ cup kamut, uncooked", "¼ cup sunflower seeds", "2 ounces feta", "½ cup fresh squeezed orange juice (app. 2 oranges)", "¼ cup walnut oil", "2 tablespoons honey", "¼-1/2 teaspoon red chili flakes"],
    "prepTime": "PT15M",
    "cookTime": "PT60M",
    "datePublished": "2013-03-18T07:36:07+00:00",
    "description": "Recently, there have been moments that catch me off my emotional guard. I'll be standing in my parents living room, thinking about my childhood/early adulth"
  };
  $scope.recipe = recipe;

  console.log(recipe);

  // test text-to-speech
  var u = new SpeechSynthesisUtterance();
  u.text = 'Speech recognition is working';
  u.lang = 'en-US';
  //speechSynthesis.speak(u);
  console.log("getIngredients() = ", getIngredients());
  var recognizer = new webkitSpeechRecognition();
  recognizer.continuous = true;
  recognizer.lang = "en";
  recognizer.onresult = function(event) {
    if (event.results.length > 0) {
      var result = event.results[event.results.length-1];
      if(result.isFinal) {
        console.log('showing text ... soon'); // check progress
        var inputText = result[0].transcript;
        console.log("you said", inputText);   // check speech-to-text result
        u.text = inputText;
        var foundIngredient = wantsOneIngredient(inputText);
        console.log(foundIngredient)
        if (foundIngredient!== false){
          console.log('ingredient = ' + foundIngredient);  // simple check
          u.text = 'The ingredients are ' + foundIngredient.join(' ');
          console.log("u.text = ", u.text);
          speechSynthesis.speak(u);
        }
      }
  }
  };
  recognizer.start();

  /**
    =======================================
    Methods
    =======================================
  */

  function getIngredients() {

    return $scope.recipe.ingredients.map(item => item.split(' '));
  }


  /**
    =======================================
    Filters
    =======================================
  */


  /**
    wantsAllIngredients - check if a user wants the list of ingredients

    @param  {string}  phrase      Input phrase
    @return {boolean }            True if user wants the list of all ingredients
                                  False otherwise
   */
  function wantsAllIngredients(phrase){
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
  function wantsOneIngredient(phrase){
    var ingredients = getIngredients();
    for (var k = 0; k < ingredients.length; k++){
      var item = ingredients[k];
      for (var i = 0, len = item.length; i < len; i++) {
        var word = item[i];
        if (isWordFound(phrase, word)) return item;
      }
    }
    return false;  // recipe contains no ingredients uttered in phrase
  }

  function wantsNextInstruction(phrase){
    return (isWordFound(phrase, "next"));
  }

  function wantsQuantity(phrase){
    if (isWordFound(phrase, "many")) return true;
    if (isWordFound(phrase, "much")) return true;
    return false;
  }

  /**
  =======================================
    Helper functions
  =======================================
   */

  function isWordFound(phrase, word){
    var tokenObjs = nlp.tokenize(phrase);
    //console.log("tokenObjs = ", tokenObjs);
    var tokens = tokenObjs[0].tokens.map(obj => obj.text);
    //console.log("tokens = ", tokens);
    return (tokens.indexOf(word) !== -1);
  }


}]);
