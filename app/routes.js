/**
* This is a file where you can define various routes globally. It's better than
* defining those in server.js, but ideally you should be defining routes as part of
* modules. @see example "hello" module to get a taste of how this works.
*/

// Third party libraries
var express = require('express')
  , app = exports = module.exports = express();

// Local includes
//var mod_hello = require('./web/hello');
var mod_pages = require('./web/pages');
var mod_blog = require('./web/blog');

/** Global ROUTES **/
app.get('/', mod_pages.callbacks.home);

/** blog ROUTES **/
//app.get('/blog', mod_blog.callbacks.list);