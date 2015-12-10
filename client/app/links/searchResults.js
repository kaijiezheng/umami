angular.module('umami.links', [])

.controller('LinksController', function ($scope, Links) {
  // Your code here
    $scope.recipes = window.testData.data;
  });
