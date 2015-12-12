angular.module('umami.recipe', ['ngRoute'])

.controller('RecipeController', function ($scope) {
  // Your code here
  $scope.hello = "hello umami voice";
  var recipe = {
    name: 'Crêpes',
    ingredients: [
      '1 cup flour',
      '1 egg',
      '1/4 teaspoon salt',
      '1 1/4 cup milk'],
    instructions: [
      'Mix',
      'Cook'],
    picUrl: "assets/chocolate.jpg"
    currInstruction: 0;
  };
  $scope.recipe = recipe;

  console.log(getIngredients());

  // test text-to-speech
  var u = new SpeechSynthesisUtterance();
  u.text = 'Speech recognition is working';
  u.lang = 'en-US';
  speechSynthesis.speak(u);

  var recognizer = new webkitSpeechRecognition();
  recognizer.continuous = true;
  recognizer.lang = "en";
  recognizer.onresult = function(event) {
    if (event.results.length > 0) {
      var result = event.results[event.results.length-1];
      if(result.isFinal) {
        console.log('showing text ... soon'); // check progress
        var inputText = result[0].transcript;
        console.log(inputText);   // check speech-to-text result
        u.text = inputText;
        speechSynthesis.speak(u);
        if (wantsIngredients(inputText)){
          var ingredients = getIngredients();
          console.log('ingredients = ' + ingredients);  // simple check
          u.text = 'The ingredients are ' + ingredients;
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
      if (isWordFound(phrase, item)) return true;
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
    
  function getText(obj){
    return obj.text;
  }

  function isWordFound(phrase, word){
    var tokenObjs = nlp.tokenize(phrase);
    var tokens = tokenObjs[0].tokens.map(getText);
    return (tokens.indexOf(word) !== -1);
  }


});
