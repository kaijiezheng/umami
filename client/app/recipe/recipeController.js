angular.module('umami.recipe', ['ngRoute'])

.controller('RecipeController', function ($scope) {
  // Your code here
  $scope.hello = "hello umami";  
  var recipe = {
    name: 'Crêpes',
    ingredients: [
      '1 cup flour', 
      '1 egg', 
      '1/4 teaspoon salt', 
      '1 1/4 cup milk'],
    instructions: [
      'Mix',
      'Cook']
  };
  $scope.recipe = recipe;

  /**
    wantsIngredients - given a text input, tests whether a user wants ingredient list

    @param  {string}  input   user provided input
    @return {boolean}         true if user wants ingredients, false otherwise          
   */
  var wantsIngredients = function(input){
    return true; // placeholder result to test
  };


  /**
    getIngredients - get ingredient list

    @param
    @return {string}  comma-separated list of ingredients
   */
  var getIngredients = function(){
    return recipe['ingredients'].join(',');
  }

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

});
