angular.module('umami.search', [])
.controller('SearchController', ['$scope', '$http', 'searchResult', 'UpdateSearch', '$location', function($scope, $http, searchResult, UpdateSearch, $location) {
  function getAll() {
    $http.get('/api/recipes/all')
    .then(function(response) {
      $scope.recipes = response.data.map((item)=>{return item._source});
      UpdateSearch.setRecipes($scope.recipes);
      console.log('new recipes from initialization:', UpdateSearch.getRecipes());
    });
  };

  $scope.recipes = UpdateSearch.getRecipes();

  // function updateData (response) {
  //   $scope.recipes = response.data.map((item)=>{return item._source});
  //   console.log("data = ", $scope.recipes);
  // }

  $scope.goRecipe = function(data){
    console.log(data);
    searchResult.setStorage(data);
    $location.path('/recipe')
  };

  if ($scope.recipes.length === 0) {
    getAll();
  }

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
