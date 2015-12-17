angular.module('umami.services', [])


.factory('searchResult', function (){
    var storage;

    function setStorage(data) {
        storage = data;
    }

    function getStorage() {
        return storage;
    }



    return {
      setStorage:setStorage,
      getStorage:getStorage
    }
})
.factory('UpdateSearch', function() {
  var recipes = [];

  function setRecipes(data) {
    recipes = data;
  }

  function getRecipes() {
    return recipes;
  }

  return {
    setRecipes: setRecipes,
    getRecipes: getRecipes
  }
})
.factory('Auth', function ($http, $location, $window) {
  // Don't touch this Auth service!!!
  // it is responsible for authenticating our user
  // by exchanging the user's username and password
  // for a JWT from the server
  // that JWT is then stored in localStorage as 'com.shortly'
  // after you signin/signup open devtools, click resources,
  // then localStorage and you'll see your token from the server
  var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signin',
      data: user
    })
    .then(function (resp) {
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
