// third party dependencies
var assert = require('assert');
var _ = require('lodash');
var Emitter = require("events").EventEmitter;
var util = require('util');
var monk = require('monk');


// module dependencies
var Doorman = require("./lib/doorman");
var Validator = require("./lib/validator");


//initializer
var Tribe = function(){
  Emitter.call(this);
  return this;
};

//inherit from Emitter
util.inherits(Tribe,Emitter);

// local private variables
//var db = {};
var doorman = null;
var validator = null;


Tribe.prototype.init = function(conf, next) {
  var self = this;
  conf = conf || {};

  if(conf.db) {
    assert.ok(conf.db.mongo_url, "need a db setting for mongo");
    self.db = monk(conf.db.mongo_url);
  }

  doorman = new Doorman(self.db);
  validator = new Validator(self.db);

  //set up the event chain
  wireEvents();

  next(null,self);

};

//the save process
var wireEvents = function(){
  doorman.on('save-requested', validator.checkRequired);
  validator.on('validated', validator.checkExistence);
  validator.on('exists', doorman.updateMember);
  //validator.on('exists', doorman.sendEmailReminder);

  validator.on('doesnt-exist', doorman.createEmailToken);
  doorman.on('email-token-created', doorman.createMember);
  //doorman.on('Email token created', doorman.sendEmailConfirmation);


  //happy path
  doorman.on("created", saveOk);
  doorman.on("updated", saveOk);

  // //sad path
  doorman.on("invalid", saveNotOk);
  validator.on("invalid", saveNotOk);

  // verification
  doorman.on('validate-token-requested', validator.checkExistence);
  validator.on('validate-token-requested', validator.verifyEmailToken);
  validator.on('token-validated', doorman.updateMember);

};

Tribe.prototype.saveMember = function(args, next){
  var self = this;
  args = args || {};

  doorman.saveMember(args,function(err,saveMemberFlow){
    if(err){
      self.emit("member-error",err);
    }else{
      self.emit("member-saved",saveMemberFlow);
    }
    next(err,saveMemberFlow);
  });
};

Tribe.prototype.authenticate = function(args, next){
  var self = this;
  args = args || {};

  doorman.authenticate(args, function(err,authMember){
    if(err) {
      return next(err)
    } 
    next(null, authMember);
  })

};


Tribe.prototype.verifyEmailToken = function(args, next){
  var self = this;
  args = args || {};

  doorman.verifyToken(args,function(err,saveMemberFlow){
    if(err){
      self.emit("member-error",err);
    }else{
      self.emit("member-saved",saveMemberFlow);
    }
    next(err,saveMemberFlow);
  });
};


var saveOk = function(saveMemberFlow){
  //just to be sure
  saveMemberFlow.success = true;
  if(saveMemberFlow.continueWith){
    saveMemberFlow.continueWith(null,saveMemberFlow);
  }
};

var saveNotOk = function(saveMemberFlow){
  //just to be sure
  saveMemberFlow.success = false;
  if(saveMemberFlow.continueWith){
    saveMemberFlow.continueWith(saveMemberFlow.message,saveMemberFlow);
  }
};


module.exports = new Tribe();

