/**
 * Created by oliverwang on 12/16/15.
 */
var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;

describe('search result controller', function () {
  var $httpBackend, createController, searchResultHandler, $scope, searchResult;
  beforeEach(module('umami'));
  beforeEach(inject(function($injector) {
    // Set up the mock http service responses
    $httpBackend = $injector.get('$httpBackend');
    searchResult = $injector.get('searchResult');
    searchResultHandler = $httpBackend.when('GET',null , '/api/recipes/all')
      .respond(
        [{
          _source: {
            name:'hello'
          }
        }]
      );

    // Get hold of a scope (i.e. the root scope)
    $scope = $injector.get('$rootScope').$new();
    // The $controller service is used to create instances of controllers
    var $controller = $injector.get('$controller');

    createController = function() {
      return $controller('SearchController', {'$scope' : $scope });
    };

  }));
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });


  it('should fetch all queries', function() {
    $httpBackend.expectGET('/api/recipes/all');
    var controller = createController();
    $httpBackend.flush();
  });

  it('should update recipes with with response', function(){
    var controller = createController();
    $httpBackend.flush();
    expect($scope.recipes).to.deep.equal([{name:'hello'}])
  });



});
