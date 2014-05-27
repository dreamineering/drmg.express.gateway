

var util = require('util');

function HTTPError() {
  Error.call(this, arguments);
}

util.inherits(HTTPError, Error);

function NotFound(message) {
  HTTPError.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.statusCode = 404;
  this.message = message;
  this.name = 'NotFound';
}

util.inherits(NotFound, HTTPError);

module.exports = {
  HTTPError: HTTPError,
  NotFound: NotFound
}