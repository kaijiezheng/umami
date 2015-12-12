/**
  Helper functions for naive testing
 */

var errorMsg = function(input, expected, result){
  console.log("Testing " + input + " should be " + expected + ", but got " + result + " instead");
}

var testInputs = function(inputs, callback){
  for (var k = 0; k < inputs.length; k++){
    var phrase = inputs[k][0];
    var expectedResult = inputs[k][1];
    if (callback(phrase) !== expectedResult){
      errorMsg(phrase, expectedResult, !expectedResult);
    }
  }
};
