angular.module('umami.search', [])
.controller('SearchController', ['$scope', '$http', 'searchResult', 'UpdateSearch', 'voiceAPI', function($scope, $http, searchResult, UpdateSearch, voiceAPI) {
  $scope.recipes = UpdateSearch.getRecipes() || [];
  voiceAPI.stop();

  // When controller first loaded, initialize with recipes
  if ($scope.recipes.length === 0) {
    initializeRecipes();
  }

  function initializeRecipes() {
    UpdateSearch.searchRecipes('/api/recipes/all')
      .then(function(response) {
        $scope.recipes = response.data.map((item)=>{return item._source});
        UpdateSearch.setRecipes($scope.recipes);
        console.log('new recipes from initialization:', $scope.recipes);
      });
  }


  // Watch for changes in recipes due to new search, necessary because of two controllers
  $scope.$watch(function() {
    return UpdateSearch.getRecipes();
  }, function(){
      $scope.recipes = UpdateSearch.getRecipes();
  }, true);
}]);
