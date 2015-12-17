/**
 * Created by oliverwang on 12/16/15.
 */
var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;


describe('Angular services', function () {

  var searchResult;
  beforeEach(module('umami'));
  beforeEach(inject(function (_searchResult_) {
    searchResult = _searchResult_;
  }));

  describe('Set and Get storage', function () {

    it('has function set storage', function () {
      expect(searchResult.setStorage).to.be.ok;
    });
    it('has function get storage', function () {
      expect(searchResult.getStorage).to.be.ok;
    });
    it('should be able to get and set storage', function () {
      searchResult.setStorage({
        name:"hello"
      })
      expect(searchResult.getStorage()).to.deep.equal({
        name:"hello"
      });
    });
  });
});

describe('search result controller', function () {
  var $httpBackend, createController, searchResultHandler, $scope, searchResult;
  beforeEach(module('umami'));
  beforeEach(inject(function($injector) {
    // Set up the mock http service responses
    $httpBackend = $injector.get('$httpBackend');
    searchResult = $injector.get('searchResult')
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
      return $controller('LinksController', {'$scope' : $scope });
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
  })

  it('updateData with Search', function(){
    var controller = createController();
    $scope.searchText = 'apples';
    $scope.search();
    $httpBackend.expectGET('/api/recipes/search/apples').respond(200,
      [{
        _source: {
          name:'hi'
        }
      }]
    );
    $httpBackend.flush();
    expect($scope.recipes).to.deep.equal([{name:'hi'}])
  })

  it('should set storage on click', function (){
    createController();
    var data = "oliver";
    $scope.goRecipe(data);
    expect(searchResult.getStorage()).to.equal(data);
    $httpBackend.flush();
  })
});
