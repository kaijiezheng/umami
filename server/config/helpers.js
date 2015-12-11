var jwt = require('jwt-simple');

module.exports = {
  errorLogger: function (error, req, res, next) {
    // Log the error then send it to the next middleware in
    console.error(error.stack);
    next(error);
  },
  errorHandler: function (error, req, res, next) {
    // Send error message to client for graceful error handling
    res.send(500, {error: error.message});
  },
  decode: function (req, res, next) {
    var token = req.headers['x-access-token'];
    var user;

    if (!token) {
      // Send forbidden if a token is not provided
      return res.send(403);
    }

    // Decode token and attach user to the request for use inside our controllers
    try {
      user = jwt.decode(token, 'secret');
      req.user = user;
      next();
    } catch (error) {
      return next(error);
    }
  }
};
