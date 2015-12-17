/**
  Recipe class
 */


/**
=======================================
  Simple tests
=======================================
 */
var recipeObj = {
  name: 'Crêpes',
  ingredients: [
    '1 cup flour',
    '1 egg',
    '1/4 teaspoon salt',
    '1 1/4 cup milk'],
  instructions: [
    'Mix',
    'Cook'],
  picUrl: "assets/chocolate.jpg",
  nextInstructionIndex: 0
};


var recipe = new Recipe(recipeObj);



/**
=======================================
  Class definition and methods
=======================================
 */
function Recipe(recipeObj){
  this.name = recipeObj.name;
  this.ingredients = recipeObj.ingredients.slice();
  this.instructions = recipeObj.instructions.slice();
  this.nextInstructionIndex = 0;
}

Recipe.prototype.getIngredients = function(){
  return this.ingredients;
};

Recipe.prototype.getNextInstruction = function(){
  var nextInstruction = this.instructions[this.nextInstruction.index];
  this.nextInstructionIndex += 1;
  return nextInstruction;
};

Recipe.prototype.getOneIngredient = function(keyword){
  return this.ingredients.indexOf(keyword);
};

Recipe.prototype.getQuantity = function(ingredient) {

};

