// module api behaviour spec

var should = require('should');
var assert = require('assert');
require('date-utils');

// Member API
var Tribe = require('../index');
var tribe = {};
// if mongo with monk
var conf = { db: { mongo_url : 'localhost/drmg_tribe_test' } };
// Sample test data

describe('members', function () {
  
  before(function(done){
    Tribe.init({}, function(err, result) {
      tribe = result;
      done();
    });
  });

  // happy path
  describe('creation', function () {
    
    describe('succeeds when', function () {
      
      describe('with correct credentials', function () {

        // setup for test
        var result = {};
        before(function(done){
          var member = {email: 'elvis@graceland.com'};
          tribe.saveMember(member, function(err, newMember){
            result = newMember;
            done();
          });
        });

        it('is successful', function () {
          result.success.should.equal(true);
        });

        it('does this thing');

      });

    });

    describe('fails when', function () {
      // body...


    });


  });

});