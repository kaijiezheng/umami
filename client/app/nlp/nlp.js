
var recipe = [
'<article class="h-recipe">',
'  <h1 class="p-name">Crêpe</h1>',
'    <ul>',
'      <li class="p-ingredient">1 cup flour</li>',
'      <li class="p-ingredient">1/4 teaspoon salt</li>',
'      <li class="p-ingredient">1 1/4 cup milk</li>',
'    </ul>',
'  <div class="e-instructions">',
'    <ol>',
'      <li>Mix</li>',
'      <li>Cook</li>',
'</ol>',
'</div>',
'</article>'
].join(" ");



/**
=======================================
  Simple tests
=======================================
 */

console.log("Hello testing");

var errorMsg = function(input, expected, result){
  console.log("Testing " + input + " should be " + expected + ", but got " + result + " instead");
}


// tests for wantsAllIngredients()
if (wantsAllIngredients("What are the ingredients") === false){
  errorMsg('true', 'false');
}
if (wantsAllIngredients("How much salt and pepper do I need") === true){
  errorMsg('false', 'true');
}
if (wantsAllIngredients("What are the ingredients") === false){
  errorMsg('true', 'false');
}
if (wantsAllIngredients("How many carrots") === true){
  errorMsg('false', 'true');
}
if (wantsAllIngredients("What's the last ingredient") === true){
  errorMsg('false', 'true');
}
if (wantsAllIngredients("Give me the list of ingredients") === false){
  errorMsg('true', 'false');
}
console.log("wantsAllIngredients() tests passed");


// tests for wantsQuantity()
if (wantsQuantity("What are the ingredients") === true){
  errorMsg('false', 'true');
}
if (wantsQuantity("How many eggs") === false){
  errorMsg('true', 'false');
}
if (wantsQuantity("How much water") === false){
  errorMsg('true', 'false');
}
if (wantsQuantity("How many bananas") === false){
  errorMsg('true', 'false');
}
if (wantsQuantity("How long in the oven") === true){
  errorMsg('false', 'true');
}
console.log("wantsQuantity() tests passed");



/** 
=======================================
Filters
=======================================
*/


/**
  wantsAllIngredients - check if a user wants the list of ingredients

  @param  {string}  phrase      Input phrase
  @return {boolean }            True if user wants the list of ingredients, false otherwise
 */   
function wantsAllIngredients(phrase){
  var s = nlp.pos(phrase).sentences[0];
  var nounsFound = s.nouns().map(getText);
  return (nounsFound.indexOf('ingredients') !== -1);
};

function wantsOneIngredient(phrase){
}

function wantsNextInstruction(phrase){

}

function wantsQuantity(phrase){
  var tokenObjs = nlp.tokenize(phrase);
  var tokens = tokenObjs[0].tokens.map(getText);
  var isManyWord = tokens.indexOf('many' !== -1);
  var isMuchWord = tokens.indexOf('much' !== -1);
  return (isManyWord || isMuchWord);
}

function wantsOneInstruction(phrase){

}


/** 
=======================================
  Helper functions
=======================================
 */
  
function getText(obj){
  return obj.text;
}


