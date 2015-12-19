angular.module('umami.search', [])
.controller('SearchController', ['$scope', '$http', 'searchResult', 'UpdateSearch', '$location', function($scope, $http, searchResult, UpdateSearch, $location) {
  $scope.recipes = UpdateSearch.getRecipes() || [];

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

  $scope.goRecipe = function(data){
    console.log(data);
    searchResult.setStorage(data);
    $location.path('/recipe')
  };

  // Watch for changes in recipes due to new search, necessary because of two controllers
  $scope.$watch(function() {
    return UpdateSearch.getRecipes();
  }, function(){
      $scope.recipes = UpdateSearch.getRecipes();
  }, true);

}])
.directive('workspace', ['$rootScope', function($rootScope) {
  return {
    constrain: 'A',
    link: function(scope, element, attrs) {
      element.ready(function() {
        var packery = new Packery(element[0], {
          rowHeight: '.module-sizer',
          itemSelector: '.module',
          columnWidth: '.module-sizer'
        });
        angular.forEach(packery.getItemElements(), function(item) {
          var draggable = new Draggabilly(item);
          packery.bindDraggabillyEvents(draggable);
        });
        packery.layout();
      });
    }
  };
}]);
