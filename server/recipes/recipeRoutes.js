var recipeController = require('./recipeController.js');

module.exports = function (app) {
  // app is actually the recipeRouter injected from middleware.js
  
  // Can use app.param('path', handler) to hijack requests and preprocess

  app.route('/').get(recipeController.allRecipes);
  app.route('/').post(recipeController.newRecipe);

  app.route('/favorites').get(recipeController.retrieveFavorites);
  app.route('/favorites').post(recipeController.addFavorite);

  app.route('/search/:query').get(recipeController.searchRecipes);
};
