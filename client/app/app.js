angular.module('umami', [
  'umami.services',
  'umami.search',
  'umami.auth',
  'umami.recipe',
  'umami.voiceAPI',
  "nlpCompromise",
  'ngRoute'
])
.config(function ($routeProvider, $httpProvider) {
  $routeProvider
    .when('/signin', {
      templateUrl: 'app/auth/signin.html',
      controller: 'AuthController'
    })
    .when('/signup', {
      templateUrl: 'app/auth/signup.html',
      controller: 'AuthController'
    })
    .when('/search', {
      templateUrl: 'app/search/searchResults.html',
      controller: 'SearchController'
      //authenticate: true
    })
    .when('/recipe/:recipeId',{
      templateUrl: 'app/recipe/recipe.html',
      controller: 'RecipeController'
    })
    .otherwise({
      redirectTo: '/search'
    });

    // We add our $httpInterceptor into the array
    // of interceptors. Think of it like middleware for your ajax calls
    //$httpProvider.interceptors.push('AttachTokens');
})
.controller('MainCtrl', function($http, UpdateSearch) {
  this.searchText = '';
  this.search = function () {
    // If query is empty string, default to query-less GET request
    var url = (this.searchText !== '') ? '/api/recipes/search/' + this.searchText : '/api/recipes/search/all'

    UpdateSearch.searchRecipes(url)
      .then(function(response) {
        console.log('successfully retrieved recipes from search');
        UpdateSearch.setRecipes(response.data.map((item)=>{return item._source}));
      });
    this.searchText = '';
  };
})
.factory('AttachTokens', function ($window) {
  // this is an $httpInterceptor
  // its job is to stop all out going request
  // then look in local storage and find the user's token
  // then add it to the header so the server can validate the request
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.umami');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})
.run(function ($rootScope, $location, Auth) {
  // here inside the run phase of angular, our services and controllers
  // have just been registered and our app is ready
  // however, we want to make sure the user is authorized
  // we listen for when angular is trying to change routes
  // when it does change routes, we then look for the token in localstorage
  // and send that token to the server to see if it is a real user or hasn't expired
  // if it's not valid, we then redirect back to signin/signup
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      $location.path('/signin');
    }
  });
});
