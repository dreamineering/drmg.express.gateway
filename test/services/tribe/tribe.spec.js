// testing dependencies
var should = require('should');
var assert = require('assert');
require('date-utils');
var monk = require('monk');
var mongoskin = require('mongoskin');

// Module dependencies
var Tribe = require('../../../services/tribe/index');

// Local test variables
var db = {};
var tribe = {};
var conf = { db: { mongo_url : 'localhost/drmg_tribe_test' } };

describe('Tribe', function () {

  before(function(done){
    Tribe.init(conf, function(err, configured){
      tribe = configured;
      db = configured.db;
      done();
    });
  });

  after(function(done){
    var members = db.get('members');
    members.remove({}, function() {
      done();
    });
  })


  describe('Joining the tribe', function () {

    describe('signup successful when', function () {

      describe('using the correct credentials', function () {

        // setup for test
        var result = {}
        before(function(done){
          var prospect = {
            email: 'elvis@graceland.com',
            password: 'hounddog',
            passwordConfirmation: 'hounddog'
          };
          tribe.saveMember(prospect, function(err, newMember){
            result = newMember;
            done();
          });
        });

        it('is successful', function () {
          result.success.should.equal(true);
        });

        it('creates a member', function () {
          result.member.should.be.defined;
        });

        it('sets the email and hashed_password', function(){
          result.member.email.should.equal('elvis@graceland.com');
          should.exist(result.member.hashedPassword);
          should.not.exist(result.member.password);
        });

        it('sets emailVerified as false', function () {
          result.member.emailVerified.should.equal(false);
        });

        it('sets up status as pending approval', function(){
          result.member.approvalStatus.should.equal('Pending approval');
        });

        it('creates a link token with expiry date', function(){
          should.exist(result.member.emailToken);
          result.member.emailToken.length.should.equal(36);
          should.exist(result.member.emailTokenExpiry);
        });

        it('sends an email with link with token for signin');

        describe('Verification success', function () {

          var validationResult = {};
          before(function(done){
            tribe.verifyEmailToken(result.member.emailToken, function(err, validatedMember){
              validationResult = validatedMember;
              done();
            });
          });

          it('is successful', function () {
            validationResult.success.should.equal(true);
          });

        });


      });

    });

    describe('signup will not succeed when', function () {

    });

    describe('Verification Signup Success', function () {

      describe('With valid confirmation or reminder link', function () {
        // body...
      });

    });

  });

  describe('authenticating', function () {

    describe('successful when', function () {

      describe('using the correct creditials', function () {

        // setup for test
        var result = {}
        before(function(done){
          var prospect = {
            email: 'elvis@graceland.com',
            password: 'hounddog',
            passwordConfirmation: 'hounddog'
          };
          tribe.saveMember(prospect, function(err, newMember){
            tribe.authenticate(
              { email : prospect.email, password : prospect.password },
              function(err, authMember){
                result = authMember;
                done();
              });
          });
        });



      });

    });

  });

});