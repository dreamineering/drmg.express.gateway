
// Third-party libraries
var _ = require('lodash')
  , express = require('express')
  , app = exports = module.exports = express();

var blog = require('../../../services/initBlog').blog;

var BlogController = require('./controllers/blog_controller');

exports.callbacks      = new BlogController(blog);

app.get('/', exports.callbacks.list);


