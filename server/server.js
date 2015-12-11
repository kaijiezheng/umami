/* Walkthrough of the server

  Express, elasticsearch, mongoose, and our server are initialzed here
  Next, we then inject our server and express into our config/middleware.js file for setup.
  We also exported our server for easy testing

  middleware.js requires all express middleware and sets it up
  our authentication is set up there as well
  we also create individual routers for are two main features, links and users
  each feature has its own folder with a model, controller, and route file
    the respective file is required in middleware.js and injected with its mini router
    that route file then requires the respective controller and sets up all the routes
    that controller then requires the respective model and sets up all our endpoints which respond to requests
*/

var SERVER_PORT = process.env.PORT || '8000';
var DB_HOST = process.env.HOST || 'localhost:9200';

var express = require('express');
var app = express();
var elasticsearch = require('elasticsearch');

// Elasticsearch server is setup here and exported for modularity
var client = new elasticsearch.Client({
  host: DB_HOST,
  log: 'trace'
});

// Configure our server with all the middleware and and routing
require('./config/middleware.js')(app, express);

app.listen(SERVER_PORT);

// Export our app and db for testing and flexibility, required by index.js
module.exports = {
  app: app,
  client: client
};
