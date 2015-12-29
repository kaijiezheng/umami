angular.module('umami.recipe', ['ngRoute'])
.controller('RecipeController', ['$scope', 'searchResult', '$routeParams','voiceAPI', function ($scope, searchResult, $routeParams,voiceAPI) {
  var recipeId = $routeParams.recipeId || '5160d4f896cc620d188cb475';
  $scope.recipe = {};
  searchResult.getRecipe(recipeId)
    .then(function(response) {
      if (response) {
        $scope.recipe = response.data[0]._source;
        $scope.recipe.instructions = $scope.recipe.instructions.filter(item => item.length > 4);
        console.log("Recipe:", $scope.recipe);
        $scope.voice = voiceAPI.start($scope.recipe);
      } else {
        $scope.voice = voiceAPI($scope.recipe);
      }
    });

}]);
