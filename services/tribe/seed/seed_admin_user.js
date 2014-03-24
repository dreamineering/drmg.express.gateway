
// run from console to add user

var Tribe = require('../index');

// Local test variables
var db = {};
var tribe = {};

// TODO link this up to config
var conf = { db: { mongo_url : 'localhost/drmg_tribe_dev' } };


Tribe.init(conf, function(err, configured){
  tribe = configured;
  db = configured.db;

  var members = db.get('members');

  members.remove({}, function() {      
    tribe.saveMember(admin, function(err, newMember){
      result = newMember;
      console.log(newMember);
    });  
  });


});



var admin = {
  email: 'matt@dreamineering.com', 
  password: 'hounddog',
  passwordConfirmation: 'hounddog',
  name: 'matt',
  admin: true 
};





