// do not tamper with this code in here, study it, but do not touch
// this Auth controller is responsible for our client side authentication
// in our signup/signin forms using the injected Auth service
angular.module('umami.auth', [])

.controller('AuthController', function ($scope, $window, $location, Auth) {
  $scope.user = {};

  $scope.signin = function () {
    console.log('signing in');
    Auth.signin($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.umami', token);
        console.log($window.localStorage);
        $location.path('/search');
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.signup = function () {
    console.log('signing up');

    Auth.signup($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.umami', token);
        $location.path('/signin');
        console.log($window.localStorage);
      })
      .catch(function (error) {
        console.error(error);
      });
  };
});
