// Elasticsearch client
var client = require('../server.js').client;
// Will not need Q given that it comes packages with elasticsearch
var Q = require('q');
// Util not being used at the moment
var util = require('../config/utils.js');

module.exports = {
  allRecipes: function() {
    // return all recipes in DB
    // might want to filter out those already favorited, but unimportant atm
  },
  newRecipe: function() {
    // user posts new recipe to database
    // automatically add to their favorites and to general database
  },
  retrieveFavorites: function() {
    // return user's favorite recipes
  },
  addFavorite: function() {
    // add favorite recipe to user's account
  },
  searchRecipes: function() {
    // search recipe database based on search term
  }
};


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
