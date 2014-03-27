
// Third-party libraries
var _ = require('lodash')
  , express = require('express')
  , app = exports = module.exports = express();

// Service
//var blog = require('../../../services/minty').minty;
var blog = require('../../../services/blog').blog;



//var tribe = require('../../../services/tribe').tribe;
var ApiBlogController = require('./controllers/api_blog_controller');

exports.callbacks = new ApiBlogController(blog);

// create
app.post("/", exports.callbacks.create);

// read
app.get("/", exports.callbacks.list);





