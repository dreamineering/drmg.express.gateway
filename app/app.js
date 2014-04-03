var express        = require('express');
var qs             = require('qs');

var CONF           = require('config');
var jwt            = require('jsonwebtoken');  //https://npmjs.org/package/node-jsonwebtoken
var expressJwt     = require('express-jwt'); //https://npmjs.org/package/express-jwt
var log            = require('metalogger')();
var hbs            = require('hbs')

// security
var allowCrossDomain    = require('../services/security/cors');
var xsrf                = require('../services/security/xsrf');
var protectJSON         = require('../services/security/protectJSON');

require('./sockets/chat');
require('./sockets/shop');

exports = module.exports;

exports.setup = function(app) {


  app.use(require('compression')());

  app.use(allowCrossDomain);
  // commented this out in favour of having control on each route  Q???
  //app.use('/api', expressJwt({secret: CONF.app.jwt_secret}));

  //app.use(express.urlencoded());  http://stackoverflow.com/questions/22143105/node-js-express-express-json-and-express-urlencoded-with-form-submit

  app.set('views', __dirname + '/views');
  app.set('view engine', 'handlebars');
  app.engine('handlebars', hbs.__express);

  app.use(require('body-parser')());
  app.use(require('method-override')());

  //app.use(express.query());
  app.use(protectJSON);

  //app.use(express.responseTime());

  // This is not needed if you handle static files with, say, Nginx (recommended in production!)
  // Additionally you should probably pre-compile your LESS stylesheets in production
  // Last, but not least: Express' default error handler is very useful in dev, but probably not in prod.
  if (('NODE_SERVE_STATIC' in process.env) && process.env['NODE_SERVE_STATIC'] == 1) {
    var pub_dir = CONF.app.pub_dir;
    if (pub_dir[0] != '/') { pub_dir = '/' + pub_dir; } // humans are forgetful
    var root_dir = require('path').dirname(module.parent.filename);
    pub_dir = root_dir + pub_dir;

    //app.use(require('less-middleware')({ src: pub_dir }));
    app.use(express.static(pub_dir));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  }

  //---- Mounting application modules
  // authentication
  app.use('/authenticate',  require('./authenticate')); // attach to sub-route

  // api
  app.use('/api/blog',  require('./api/blog'));
  app.use('/api/products',  require('./api/shop'));

  // web sub routes
  app.use('/hello', require('./web/hello'));
  app.use('/pages', require('./web/pages'));
  app.use('/blog',  require('./web/blog'));

  app.use(require('./routes')); // attach to root route

  //--- End of Internal modules

  // Catch-all error handler. Modify as you see fit, but don't overuse.
  // Throwing exceptions is not how we normally handle errors in Node.
  app.use(function catchAllErrorHandler(err, req, res, next){

    if (err.constructor.name === 'UnauthorizedError') {
      res.send(401, 'Unauthorized');
    } else {
      // Emergency: means system is unusable
      log.emergency(err);
      res.send(500);
      // We aren't in the business of hiding exceptions under the rug. It should
      // still crash the process. All we want is: to properly log the error before
      // that happens.
      //
      // Clustering code in the lib/clustering module will restart the crashed process.
      // Make sure to always run clustering in production!
      setTimeout(function() { // Give a chance for response to be sent, before killing the process
        process.exit(1);
      }, 10);

    }
  });
};
