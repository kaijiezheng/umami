angular.module('umami.links', [])


.controller('LinksController', ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout) {

  $scope.recipes = window.testData.data;

}]);
