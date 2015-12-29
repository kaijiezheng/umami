/**
 * Created by oliverwang on 12/28/15.
 */
var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;

describe('search result controller', function () {
  var $httpBackend, createController, $scope, voiceAPI;
  beforeEach(module('umami'));
  beforeEach(inject(function($injector) {
    // Set up the mock http service responses
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('GET', null, '/api/recipes/test').respond(
      [{
        _source: {
          name:'hello',
          instructions:['1.', 'lick your elbows', '2.', 'see instruction 1']
        }
      }]
    );
    voiceAPI = $injector.get('voiceAPI');
    // Get hold of a scope (i.e. the root scope)
    $scope = $injector.get('$rootScope').$new();
    // The $controller service is used to create instances of controllers
    var $controller = $injector.get('$controller');


    createController = function() {
      return $controller('RecipeController', {'$scope' : $scope, $routeParams: {recipeId: 'test'}});
    };

  }));
  //make sure there are no pending requests
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should make a request according to the ID', function (){
    $httpBackend.expectGET('/api/recipes/test');
    createController();
    $httpBackend.flush();
  });

  it('should filter out instructions shorter than 4 characters long', function (){

    createController();
    $httpBackend.flush();
    expect($scope.recipe.instructions.length).to.equal(2)
  })

});
