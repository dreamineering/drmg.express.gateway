// pojo

"use strict";

var assert = require("assert");
var _ = require("lodash");
require("date-utils");

var Member = function(args){

  //can't have an article without a title and body
  //assert.ok(args.email, "Must have an email");

  this.email = args.email;
  this.name = args.name;
  this.bio = args.bio;
  this.admin = args.admin || false;
  this.emailVerified = args.emailVerified || false;
  this.approvalStatus = args.approvalStatus || 'Pending approval' ;
  this.createdAt = args.createdAt || new Date();
  this.updatedAt = new Date();
  this.tags = args.tags || [];

  if(args.hashedPassword){
    this.hashedPassword = args.hashedPassword;
  };

  if(args.salt){
    this.salt = args.salt;
  };

  if(args.emailToken) {
    this.emailToken = args.emailToken;
  };

  if(args.emailTokenExpiry) {
    this.emailTokenExpiry = args.emailTokenExpiry;
  };

  if(args.emailVerificationTimestamp) {
    this.emailVerificationTimestamp = args.emailVerificationTimestamp;
  };

  this.updateTo = function(changes){
    _.extend(this,changes);
    return this;
  };

  return this;
};


module.exports = Member;
