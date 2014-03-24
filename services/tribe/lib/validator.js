// member validation code
var assert = require('assert');
var Emitter = require('events').EventEmitter;
var util = require('util');
var debug = require('debug');

var Member = require('../models/member');

var Validator = function(db){
  'use strict';
  Emitter.call(this);
  var self = this;

  //make sure a db is passed in
  assert.ok(db, "Need a datastore to work with");
  var members = db.get('members');

  self.checkRequired = function(saveMemberFlow) {
    if( 
      //validEmail(saveMemberFlow.changes.email) 
      saveMemberFlow.changes.email
      && saveMemberFlow.changes.password 
      && saveMemberFlow.changes.passwordConfirmation ){
        //debug('validated');
        self.emit("validated", saveMemberFlow);
    }else{
      saveMemberFlow.setInvalid("Need an email, password, and password confirmation", saveMemberFlow);
      self.emit("invalid", saveMemberFlow);
    }    
  };    

    // // check for valid inputs
    // if (!username || !email || !password) {
    //   error = 'All fields are required';
    // } else if (username !== encodeURIComponent(username)) {
    //   error = 'Username may not contain any non-url-safe characters';
    // } else if (!email.match(EMAIL_REGEXP)) {
    //   error = 'Email is invalid';
    // }

  self.checkExistence = function(saveMemberFlow) {
    members.findOne({email : saveMemberFlow.changes.email}, function(err, found){
      if (found) {
        debug('check for existence');
        //move the passed in bits to the changes to be made
        saveMemberFlow.member = new Member(found);
        self.emit('exists', saveMemberFlow );          
      } else {
        self.emit('doesnt-exist', saveMemberFlow );
      }
    });
  };


  self.verifyEmailToken = function(saveMemberFlow) {
    // check for a matching email
    if (validEmailToken(saveMemberFlow.changes.emailToken)) {

      members.findOne({email_token : saveMemberFlow.changes.emailToken }, function(err, member){

        if (member) { 
          saveMemberFlow.member = new Member(member);
          if (new Date(saveMemberFlow.member.emailTokenExpiry) < new Date()) {

            saveMemberFlow.changes.emailVerificationTimestamp = new Date();
            saveMemberFlow.changes.emailVerified = true;

            // remove token and token expiration date from user object
            saveMemberFlow.changes.signupToken = 'delete';

            self.emit('token-validated', saveMemberFlow );
          } else {
            saveMemberFlow.setInvalid("Token has expired", saveMemberFlow);
            self.emit("invalid", saveMemberFlow);  
          }
        } else {
          saveMemberFlow.setInvalid("Verification token is not valid", saveMemberFlow);
          self.emit("invalid", saveMemberFlow);    
        }
      })

    } else {
      saveMemberFlow.setInvalid("Verification token is not valid", saveMemberFlow);
      self.emit("invalid", saveMemberFlow);
    }
    
  };


};

var validEmail = function (email) {
  // need an email, username, password, password confirmation
  var EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
  return (!email || !email.match(EMAIL_REGEXP));
};

var validEmailToken = function(token) {
  // verify format of token
  var re = new RegExp('[0-9a-f]{22}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}', 'i');
  return (!re.test(token));
};

util.inherits(Validator, Emitter);
module.exports = Validator;