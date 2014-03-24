// the underscore ensures this file loads first


// set the enviroment for node to test
process.env.NODE_ENV = 'test';

//require('coffee-script');
require(__dirname + '/helpers/extra_asserts');


var setup = function() {

  // stuff to be shared

  return {

  }

}();

module.exports = setup;
