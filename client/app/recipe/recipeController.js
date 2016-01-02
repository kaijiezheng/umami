angular.module('umami.recipe', ['ngRoute'])
.controller('RecipeController', ['$scope', 'searchResult', '$routeParams','voiceAPI', function ($scope, searchResult, $routeParams,voiceAPI) {
  //safeguard in case user tries to route to recipe without a valid recipeId
  var recipeId = $routeParams.recipeId || '5160d4f896cc620d188cb475';
  $scope.recipe = {};
  searchResult.getRecipe(recipeId)
    .then(function(response) {
      if (response) {
        $scope.recipe = response.data[0]._source;
        //get rid of the steps that are just step numbers e.g. "1."
        $scope.recipe.instructions = $scope.recipe.instructions.filter(item => item.length > 4);
        console.log("Recipe:", $scope.recipe);
        $scope.startRecord = voiceAPI.start($scope.recipe).startRecord;
      } else {
        $scope.voice = voiceAPI($scope.recipe);
      }
    });

}]);
