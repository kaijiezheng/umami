/**
 * A module that contains all functions to handle tour requests
 * @module config/helpers
 * @require jwt-simple
 */
var jwt = require('jwt-simple');

/**
 * Helper functions for error logging and token decoding.
 *
 */
module.exports = {
  /**
   * Error logging middleware.
   * @param {error} error - The error that was encountered.
   * @param {object} req - Contains request parameters.
   * @param {object} res - Contains response parameters.
   * @param {function} next - Calls next middleware.
   */
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
