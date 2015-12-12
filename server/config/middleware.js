// Logging incoming requests
var morgan = require('morgan');
var bodyParser = require('body-parser');
// Custom middleware for error and token handling
var helpers = require('./helpers.js');

module.exports = function (app, express, client) {
  // User and recipe routers have their own configurations
  var userRouter = express.Router();
  var recipeRouter = express.Router();

  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../client'));

  app.use('/api/users', userRouter);

  // Optional token handling if we want to make users sign up and sign in
  // app.use('/api/recipes', helpers.decode);

  app.use('/api/recipes', recipeRouter);

  // Error logging and handling
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

  // Inject our routers into their respective route files
  require('../users/userRoutes.js')(userRouter);
  require('../recipes/recipeRoutes.js')(recipeRouter, client);
};
