
// Third party dependencies
var assert = require('assert');
var _ = require('lodash');
var Emitter = require('events').EventEmitter;
var util = require('util');
var uuid = require("node-uuid");
require("date-utils");
var moment = require('moment');
var bcrypt = require('bcrypt-nodejs');


// model dependencies
var Member = require('../models/member');

//flow control
var SaveMemberFlow = require('../flows/save_member_flow');

// controls who come in and out
var Doorman = function(db) {
  'use strict';
  Emitter.call(this);
  var self = this;

  //make sure a db is passed in
  assert.ok(db, "Need a datastore to work with");
  var members = db.get('members');

  // this is the function that leads the proccess setting up the 'flow' object
  self.saveMember = function(member, next) {

    member.salt = generateSalt();
    member.hashedPassword = encryptPassword(member.password, member.salt);
    // there's workflow here, so hand it off to the save event-chain
    var saveMemberFlow = new SaveMemberFlow({changes : member});
    // save the callback that handles termination of the flow (valid / invalid)
    saveMemberFlow.continueWith = next;
    self.emit('save-requested', saveMemberFlow);
  };

  self.createEmailToken = function(saveMemberFlow){
    saveMemberFlow.changes.emailToken = uuid.v4();
    saveMemberFlow.changes.emailTokenExpiry = emailExpiry();
    self.emit('email-token-created', saveMemberFlow);
  };

  self.createMember = function(saveMemberFlow){
    var newMember = new Member(saveMemberFlow.changes);
    members.insert(newMember, function(err, result){
      //console.log('insert result', result);
      if(err){
        saveMemberFlow.setInvalid(err);
        self.emit('invalid',saveMemberFlow);
      } else {
        saveMemberFlow.member = new Member(result);
        saveMemberFlow.setSuccessful('Member created');
        self.emit('created', saveMemberFlow);
      }
    });
  };

  self.updateMember = function(saveMemberFlow){

    // apply changes
    saveMemberFlow.member.updateTo(saveMemberFlow.changes);

    if (saveMemberFlow.changes.signupToken === 'delete-me') {
      // delete the keys
      // delete saveMemberFlow.member.signupToken;
    }

    members.update({email : saveMemberFlow.member.email}, saveMemberFlow.member, function(err, res){
      if (err) {
        saveMemberFlow.setInvalid(err);
        self.emit('invalid', saveMemberFlow);
      } else {
        saveMemberFlow.setSuccessful('Member updated');
        self.emit('updated', saveMemberFlow);
      }
    });
  };


  self.authenticate = function(credentials, next) {

    assert(credentials.email && credentials.password, "Need email and password");

    members.findOne({ email : credentials.email }, function( err, member) {

      if (err) {
        return next(err, null);
      }
      if (member == null) {
        return next({ message : 'Unknown User' } , null);
      }
      if (member && member.hashedPassword != encryptPassword(credentials.password, member.salt)) {
        return next({ message : 'Invalid password' }, null)
      }

      next(null, member);

    });
  }

  // this is the function that leads the proccess setting up the 'flow' object
  self.verifyToken = function(member, next) {
    // there's workflow here, so hand it off to the save event-chain
    var saveMemberFlow = new SaveMemberFlow({changes : member});
    // save the callback that handles termination of the flow (valid / invalid)
    saveMemberFlow.continueWith = next;
    self.emit('validate-token-requested', saveMemberFlow);
  };

  self.sendEmailConfirmation = function(saveMemberFlow){
    // send email with link for address verification
    // var mail = new Mail('emailSignup');
    // mail.send(user.username, user.email, user.signupToken, function(err, res) {
    //   if (err) console.log(err);
    //   response.render(path.join(__dirname, 'views', 'post-signup'), {
    //     title: 'Sign up - Email sent'
    //   });
    // });
  };

  self.sendEmailReminder = function(saveMemberFlow){
    debug('email already in db');
    // send already registered email
    // var mail = new Mail('emailSignupTaken');
    // mail.send(user.username, user.email, function(err, res) {
    //   if (err) console.log(err);
    //   response.render(path.join(__dirname, 'views', 'post-signup'), {
    //     title: 'Sign up - Email sent'
    //   });
    // });
  };

  return self;

};


var emailExpiry = function() {
  // todo move this into config
  var timespan = '1 day';
  return moment().add(timespan, 'ms').toDate();
};

var generateSalt = function () {
  return bcrypt.genSaltSync();
};

// utility functions
var encryptPassword = function (password, salt) {
  return bcrypt.hashSync(password, salt);
};


util.inherits(Doorman, Emitter);
module.exports = Doorman;

