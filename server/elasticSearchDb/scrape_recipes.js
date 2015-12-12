var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

// var recipeSources = 'epicurious';
// 'tastykitchen'
// 'allkitchen'
// 'epicurious'

fs.readFile('./epicurious-recipes-filtered.json', 'utf8', function(err, data) {
  if (err) { throw err; }

  bulk_request = data.split('\n').reduce(function(bulk_request, line) {
    var obj;

    try {
      obj = JSON.parse(line);
    } catch(e) {
      console.error(e);
      return bulk_request;
    }

    bulk_request.push(obj);
    return bulk_request;
  }, []);

  bulk_request = bulk_request.slice(4000);

  bulk_request.forEach(function(recipe, ind) {
    request(recipe.url, function(error, response, html){
      if (!error) {
        var $ = cheerio.load(html);

        var containingDiv = $('.social-img');
        var imageUrlDOM = containingDiv.children()[0];
        if (imageUrlDOM) {
          var imageUrl = 'http://' + imageUrlDOM.attribs['gumby-media'].split('//')[1].split(',')[0];
          recipe.image = imageUrl;

          var steps = [];
          var stepsDOM = $('.preparation-step');

          for (var i = 0, len = stepsDOM.length; i < len; i++) {
            for (var j = 0, clen = stepsDOM[i].children.length; j < clen; j++) {
              if (stepsDOM[i].children[j].type === 'text') {
                steps = steps.concat(stepsDOM[i].children[j].data.trim().split('. '));
              }
            }
          }

          var instructions = [];
          steps.forEach(function(step, ind) {
            if (step) {
              if (step.charAt(step.length-1) !== '.') {
                instructions.push(step + '.');
              } else {
                instructions.push(step);
              }
            }
          });

          recipe.instructions = instructions;

          var data = JSON.stringify(recipe);
          fs.appendFileSync('epicurious-recipes-filtered-scraped-test5.json', data + '\n', 'utf8', function(err) {
            if (err) {
              console.log('Error in appending recipe to file');
              throw err;
            }
          });
        }
      }
    });
  });
  console.log('Completed scraping');
});
