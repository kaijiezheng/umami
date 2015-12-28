angular.module('umami.services', [])
.factory('searchResult',['$http', function ($http){


    function getRecipe(recipeId) {
      return $http.get('/api/recipes/'+recipeId);
    }

    return {
      getRecipe: getRecipe
    }
}])
.factory('UpdateSearch', function($http) {
  var recipes = [];

  /**
  * Basic http request to retrieve recipes.
  * @method searchRecipes
  * @param {string} url The api url on our backend for elasticsearch.
  */
  function searchRecipes(url) {
    return $http.get(url);
  }

  /**
  * Saves array of recipes so data can persist between main controller and recipe controller.
  * @method setRecipes
  * @param {object} data Array of recipe objects.
  */
  function setRecipes(data) {
    recipes = data;
  }

  /**
  * Retrieves array of recipes shared between main controller and recipe controller.
  * @method getRecipes
  */
  function getRecipes() {
    return recipes;
  }

  // Return factory functions for searching new recipes and accessing those results.
  return {
    searchRecipes: searchRecipes,
    setRecipes: setRecipes,
    getRecipes: getRecipes
  }
})
.factory('Auth', function ($http, $location, $window) {
  // Don't touch this Auth service!!!
  // it is responsible for authenticating our user
  // by exchanging the user's username and password
  // for a JWT from the server
  // that JWT is then stored in localStorage as 'com.umami'
  // after you signin/signup open devtools, click resources,
  // then localStorage and you'll see your token from the server
  var signin = function (user) {
    console.log('factory signin');
    return $http({
      method: 'POST',
      url: '/api/users/signin',
      data: user
    })
    .then(function (resp) {
      console.log("front - sign in success");
      console.log(resp);
      return resp.data.token;
    });
  };

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signup',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('com.umami');
  };

  var signout = function () {
    $window.localStorage.removeItem('com.umami');
    $location.path('/signin');
  };

  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };
});
