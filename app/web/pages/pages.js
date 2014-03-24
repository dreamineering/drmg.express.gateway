
// third party libraries
var _ = require('lodash');
var express = require('express');
var app = exports = module.exports = express();


exports.callbacks = require('./controllers/pages_controller');

app.get('/', exports.callbacks.home);