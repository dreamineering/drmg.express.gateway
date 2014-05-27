var CONF = require('config');
var jwt = require('jsonwebtoken');

var AuthenticationController = function(tribe) {

  // create
  this.signup = function(req, res) {

    return tribe.saveMember(req.body, function(err, profile){

      if (err) {
        return res.send(400, err)
      }

      // Send the profile inside the token
      var token = jwt.sign(profile, CONF.app.jwt_secret, { expiresInMinutes: 60*5 });

      return res.json({ token : token });

    });

  };

  // post
  this.login = function(req, res) {

    return tribe.authenticate({ email : req.body.email, password : req.body.password }, function (err, profile) {

      if (err) {
        console.log(err);
        return res.send(401, err);
      }

      // Send the profile inside the token
      var token = jwt.sign(profile, CONF.app.jwt_secret, { expiresInMinutes: 60*5 });

      return res.json({ token : token });

    });

  };

  this.logout = function(req, res) {

  };

  this.changePassword = function(req, res) {
    // get key sent out by email with new password that requires confirmation

  };

};

module.exports = AuthenticationController;
