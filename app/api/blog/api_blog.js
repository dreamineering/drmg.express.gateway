
// Third-party libraries
var _ = require('lodash')
  , express = require('express')
  , app = exports = module.exports = express();

// Lib
var blog = require('../../../lib/init/blog_init').blog;

var ApiBlogController = require('./controllers/api_blog_controller');

exports.callbacks = new ApiBlogController(blog);

// create
app.post("/", exports.callbacks.create);

// read
app.get("/", exports.callbacks.list);

