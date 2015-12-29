describe('AuthController', function () {
  var $scope, $rootScope, $location, $window, $httpBackend, createController, Auth;

  // using angular mocks, we can inject the injector
  // to retrieve our dependencies
  beforeEach(module('shortly'));
  beforeEach(inject(function ($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    $window = $injector.get('$window');
    $httpBackend = $injector.get('$httpBackend');
    Auth = $injector.get('Auth');
    $scope = $rootScope.$new();

    var $controller = $injector.get('$controller');

    // used to create our AuthController for testing
    createController = function () {
      return $controller('AuthController', {
        $scope: $scope,
        $window: $window,
        $location: $location,
        Auth: Auth
      });
    };

    createController();
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
<<<<<<< HEAD
    $window.localStorage.removeItem('com.umami');
=======
    $window.localStorage.removeItem('com.shortly');
>>>>>>> c14a1a33c48a4cc0d2f34c0849d1cd815053c80a
  });

  it('should have a signup method', function () {
    expect($scope.signup).to.be.a('function');
  });

  it('should store token in localStorage after signup', function () {
    // create a fake JWT for auth
    var token = 'sjj232hwjhr3urw90rof';

    // make a 'fake' reques to the server, not really going to our server
    $httpBackend.expectPOST('/api/users/signup').respond({token: token});
    $scope.signup();
    $httpBackend.flush();
<<<<<<< HEAD
    expect($window.localStorage.getItem('com.umami')).to.be(token);
=======
    expect($window.localStorage.getItem('com.shortly')).to.be(token);
>>>>>>> c14a1a33c48a4cc0d2f34c0849d1cd815053c80a
  });

  it('should have a signin method', function () {
    expect($scope.signin).to.be.a('function');
  });

  it('should store token in localStorage after signin', function () {
    // create a fake JWT for auth
    var token = 'sjj232hwjhr3urw90rof';
    $httpBackend.expectPOST('/api/users/signin').respond({token: token});
    $scope.signin();
    $httpBackend.flush();
<<<<<<< HEAD
    expect($window.localStorage.getItem('com.unami')).to.be(token);
=======
    expect($window.localStorage.getItem('com.shortly')).to.be(token);
>>>>>>> c14a1a33c48a4cc0d2f34c0849d1cd815053c80a
  });
});
