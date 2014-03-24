
// Third-party libraries
var _ = require('lodash')
  , express = require('express')
  , app = exports = module.exports = express();

// Don't just use, but also export in case another module needs to use these as well.
exports.callbacks      = require('./controllers/hello');
exports.view_models    = require('./view_models'); 

//-- You could also serve templates with local paths, but using shared layouts and partials may become tricky
//var hbs = require('hbs');
//app.set('views', __dirname + '/views');
//app.set('view engine', 'handlebars');
//app.engine('handlebars', hbs.__express);

// Module's Routes. Please note this is actually under /hello, because module is attached under /hello
app.get('/', exports.callbacks.sayHello);
