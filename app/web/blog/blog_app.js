
// Third-party libraries
var _ = require('lodash')
  , express = require('express')
  , app = exports = module.exports = express();

// Lib
var blog = require('../../../lib/init/blog_init').blog;

var BlogController = require('./controllers/blog_controller');

exports.callbacks      = new BlogController(blog);

app.get('/', exports.callbacks.list);


