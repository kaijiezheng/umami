var fs = require('fs');

var recipeSources = {
  'tastykitchen': true,
  'allkitchen': true,
  'epicurious': true
};

fs.readFile('./full-recipes.json', 'utf8', function(err, data) {
  if (err) { throw err; }

  var bulk_request = {
    'tastykitchen': [],
    'allkitchen': [],
    'epicurious': []
  }

  // Build up a giant bulk request for elasticsearch.
  bulk_request = data.split('\n').reduce(function(bulk_request, line) {
    var obj, recipe;

    try {
      obj = JSON.parse(line);
    } catch(e) {
      console.error(e);
      return bulk_request;
    }

    // bulk_request.push({index: {_index: 'recipes', _type: 'recipe', _id: recipe.id}});
    if (recipeSources[obj.source]) {
      // Rework the data slightly
      recipe = {
        id: obj._id.$oid, // Was originally a mongodb entry
        name: obj.name,
        source: obj.source,
        url: obj.url,
        recipeYield: obj.recipeYield,
        ingredients: obj.ingredients.split('\n'),
        prepTime: obj.prepTime,
        cookTime: obj.cookTime,
        datePublished: obj.datePublished,
        description: obj.description
      };

      var hasIngredients = true;

      for (var i = 0, len = recipe.ingredients.length; i < len; i++) {
        if (!recipe.ingredients[i]) {
          hasIngredients = false;
        }
      }

      if (hasIngredients) {
        bulk_request[recipe.source].push(recipe);
      }

    }
    return bulk_request;
  }, bulk_request);

  for (key in bulk_request) {
    bulk_request[key].forEach(function(recipe) {
      var data = JSON.stringify(recipe);
      fs.appendFileSync(key + '-recipes-filtered.json', data + '\n', 'utf8', function(err) {
        if (err) {
          console.log('Error in appending recipe to file');
          throw err;
        }
      });
    });
  }

  // bulk_request.forEach(function(recipe) {
  //   var data = JSON.stringify(recipe);
  //   fs.appendFileSync(recipeSource + '-recipes.json', data + '\n', 'utf8', function(err) {
  //     if (err) {
  //       console.log('Error in appending recipe to file');
  //       throw err;
  //     }
  //   });
  // });

  console.log('Completed filtering');
});
