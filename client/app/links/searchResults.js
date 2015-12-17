angular.module('umami.links', [])
.controller('LinksController', ['$scope', '$http', 'searchResult', '$location', function($scope, $http, searchResult, $location) {
  $scope.getAll = function (){
      $http.get('/api/recipes/all')
      .then(updateData);
    };

  function updateData (response) {
    console.log("data = ", JSON.stringify(response.data));
    $scope.recipes = response.data.map((item)=>{return item._source;});
  }

  $scope.search = function () {
    $http.get("/api/recipes/search/"+$scope.searchText)
      .then(updateData)
  };

  $scope.goRecipe = function(data){
    searchResult.setStorage(data);
    $location.path('/recipe')
  };

  $scope.getAll();


}]);
