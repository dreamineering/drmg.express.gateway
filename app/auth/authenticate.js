

// Third-party libraries
var _ = require('lodash')
  , express = require('express')
  , app = exports = module.exports = express();

var tribe = require('../../lib/init/tribe_init').tribe;
var AuthenticationController = require('./controllers/authentication_controller');

exports.callbacks = new AuthenticationController(tribe);

// create
app.post("/", exports.callbacks.login);

app.post("/signup", exports.callbacks.signup);

// app.post("/logout", exports.callbacks.logout);

// app.get("/", exports.callbacks.list);

