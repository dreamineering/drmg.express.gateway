
var Tribe = require('../auth/tribe');

var tribe = {};
var conf = {
  db: {
    mongo_url : 'localhost/drmg_tribe_dev'
  }
};

Tribe.init(conf, function(err, configured){
  tribe = configured;
});


exports.tribe = tribe;