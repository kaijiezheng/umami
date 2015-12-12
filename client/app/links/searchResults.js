angular.module('umami.links', [])
.controller('LinksController', ['$scope', '$http', 'searchResult', '$location', function($scope, $http, searchResult, $location) {
  $scope.getAll = function (){
      $http.get('/api/recipes/all')
      .then(updateData);
    };

  function updateData (response) {
    $scope.recipes = response.data.map((item)=>{return item._source});
    console.log("data = ", $scope.recipes);
  }

  $scope.search = function () {
    $http.get("/api/recipes/search/"+$scope.searchText)
      .then(updateData)
  };

  $scope.goRecipe = function(data){
    console.log(data);
    searchResult.setStorage(data);
    $location.path('/recipe')
  };

  $scope.getAll();


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
