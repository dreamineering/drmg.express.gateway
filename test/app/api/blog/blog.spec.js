// /*
//  * DREAMS API SPECS
//  */

// var utils = require('../../../helpers/utils')
//     , should = require('should')
//     , request = require('supertest')
//     , superagent = require('superagent')
//     , config = require('../../../../src/config/config')
//     , app = utils.app
//     , User = utils.mongoose.model('User')
//     , validUserData = require('../../../helpers/fixtures/fixtures').validUser;

// describe('DREAMS REST API', function(){

//   var baseUrl = 'http://localhost:' + config.test.listenPort
//       , path = '/v1/dreams'
//       , endpoint = baseUrl + path
//       , currentUser;

//   describe('anonymous user', function() {

//     it('should have access denied', function(done){
//       // POST on /api/users and we want to send some info
//       // We do this using the request object, requiring supertest!
//       request(app)
//         .get(path)
//         .end(function(err, res) {
//           if (err) { throw(err); }
//           res.should.have.status(401);
//           done();
//         });
//     });
//   });

//   describe('authenticated user', function() {

//     var agent = superagent.agent();  

//     before(function(done) {
//       currentUser = new User(validUserData);
//       currentUser.save(function (err, createdUser) {
//         if (err) { throw(err); }
//         done();
//       });
//     }); 

//     it('can view dreams', function(done) {
//         agent.get(endpoint + '?access_token=' + currentUser.token)
//           .set('access_token', currentUser.token)
//           .end(function(err, res) {
//             res.should.have.status(200);
//             //console.log("agent", agent.token);
//             return done();
//         });        
//     });
//   });

// });
