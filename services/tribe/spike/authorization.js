var express = require('express');
var passport = require('passport');
// var app = express();

var filterUser = function(user) {
  if ( user ) {
    return {
      user : {
        id:   user._id,
        email: user.email,
        username: user.username,
        admin: user.admin
      }
    };
  } else {
    return { user: null };
  }
};

var security = {
  authenticationRequired: function(req, res, next) {
    //console.log('authRequired');
    if (req.isAuthenticated()) {
      next();
    } else {
      res.json(401, filterUser(req.user));
    }
  },
  adminRequired: function(req, res, next) {
    //console.log('adminRequired');
    if (req.user && req.user.admin ) {
      next();
    } else {
      res.json(401, filterUser(req.user));
    }
  },
  sendCurrentUser: function(req, res, next) {
    res.json(200, filterUser(req.user));
    res.end();
  },
  logout: function(req, res, next) {
    req.logout();
    res.send(204);
  }
};

module.exports = security;



// // require login
// exports.apiAuthentication = function (req, res, next) {
//   if (req.isAuthenticated()) { return next(); }
//   return res.json(401, { 'err': 'Authentication failed. Please log in.'});
// }



// /*
//  *  User authorizations routing middleware
//  */

// exports.user = {
//     hasAuthorization : function (req, res, next) {
//       if (req.profile.id != req.user.id) {
//         return res.json(404, { 'err': 'Resource does not exist'});
//       }
//       next()
//     }
// }


// /*
//  *  Article authorizations routing middleware
//  */

// exports.article = {
//     hasAuthorization : function (req, res, next) {
//       if (req.article.user.id != req.user.id) {
//         return res.json(404, { 'err': 'Resource does not exist'});
//       }
//       next()
//     }
// }
