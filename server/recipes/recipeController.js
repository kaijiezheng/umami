/**
 * A module that contains all functions to handle recipe requests
 * @module recipes/recipeController
 */

// Elasticsearch client
// Will not need Q given that it comes packages with elasticsearch
var Q = require('q');
// Util not being used at the moment
var util = require('../config/utils.js');

module.exports = function(client) {
  return {
    /**
     * Retrieve all recipes in database.
     * @method allRecipes
     * @param {object} req - Contains request parameters.
     * @param {object} res - Contains response parameters.
     * @param {function} next - Calls next middleware.
     */
    allRecipes: function(req, res, next) {
      client.search({
        index: 'recipes',
        type: 'recipe',
        size: 30
      })
      .then(function(response) {
        console.log('Succesfully retrieved all recipes');
        // Returns an array of hits
        res.json(response.hits.hits);
        next();
      }, function(error) {
        console.log('Error in retrieving all recipes', error.message);
        next(error);
      });
    },
    newRecipe: function(req, res, next) {
      // user posts new recipe to database
      // automatically add to their favorites and to general database
    },
    retrieveFavorites: function(req, res, next) {
      // return user's favorite recipes
    },
    addFavorite: function(req, res, next) {
      // add favorite recipe to user's account
    },
    searchRecipes: function(req, res, next) {
      console.log('Searching for specific recipes');
      var userQuery = req.path.split('/')[2];
      client.search({
        index: 'recipes',
        type: 'recipe',
        size: 30,
        body: {
          query: {
            filtered: {
              query: {
                match: {
                  // match the query agains all of
                  // the fields in the posts index
                  _all: userQuery
                }
              }
            }
          }
        }
      })
      .then(function(response) {
        console.log('Succesfully retrieved all recipes');
        // Returns an array of hits
        res.json(response.hits.hits);
        next();
      }, function(error) {
        console.log('Error in retrieving all recipes', error.message);
        next(error);
      });
    },
    getRecipe: function (req, res, next) {
      console.log('req.params = ',req.params)
      client.search({
        index: 'recipes',
        type: 'recipe',
        size: 1,
        body: {
          query: {
            filtered: {
              query: {
                match: {
                  // match the query agains all of
                  // the fields in the posts index
                  id: req.params.recipeId
                }
              }
            }
          }
        }
      })
      .then(function(response) {
        console.log('Succesfully retrieved all recipes');
        // Returns an array of hits
        res.json(response.hits.hits);
        next();
      }, function(error) {
        console.log('Error in retrieving all recipes', error.message);
        next(error);
      });
    }



  }
};

//  allLinks: function (req, res, next) {
//  var findAll = Q.nbind(Link.find, Link);
//
//  findAll({})
//    .then(function (links) {
//      res.json(links);
//    })
//    .fail(function (error) {
//      next(error);
//    });
//  },

//  findUrl: function (req, res, next, code) {
//    var findLink = Q.nbind(Link.findOne, Link);
//    findLink({code: code})
//      .then(function (link) {
//        if (link) {
//          req.navLink = link;
//          next();
//        } else {
//          next(new Error('Link not added yet'));
//        }
//      })
//      .fail(function (error) {
//        next(error);
//      });
//  },


// Example elastic search query with callback instead of promise
// client.search({
//   q: 'pants'
// }, function(error, response) {
// })

// Example elastic search query with query string and promises
// client.search({
//   q: 'pants'
// }).then(function (body) {
//   var hits = body.hits.hits;
// }, function (error) {
//   console.trace(error.message);
// });

// Example elastic search query with full query body
// client.search({
//   index: 'myindex',
//   body: {
//     query: {
//       match: {
//         title: 'test'
//       }
//     },
//     facets: {
//       tags: {
//         terms: {
//           field: 'tags'
//         }
//       }
//     }
//   }
// }, function (error, response) {
//   // ...
// });

// Example elastic search JSON response
// {
//     "took": 739,
//     "timed_out": false,
//     "_shards": {
//       "total": 5,
//       "successful": 5,
//       "failed": 0
//     },
//     "hits": {
//       "total": 1,
//       "max_score": 1,
//       "hits": [
//         {
//           "_index": "music-albums",
//           "_type": "hip-hop-albums",
//           "_id": "23729136",
//           "_score": 1,
//           "_source": {
//             "album_id": 23729136,
//             "album_name": "Views From The 6",
//             "artist_firstname": "Aubrey",
//             "artist_middlename": "Graham",
//             "artist_lastname": "Drake",
//             "city": "toronto",
//             "features": [
//               "The Weeknd"
//             ],....cont}
