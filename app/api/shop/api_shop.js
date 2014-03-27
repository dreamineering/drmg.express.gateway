
// Third-party libraries
var _           = require('lodash');
var express     = require('express');
var app         = exports = module.exports = express();
var CONF        = require('config');
var expressJwt  = require('express-jwt');

// Service
var Shop = require('../../../services/shop');

var ApiProductsController = require('./controllers/api_product_controller');

exports.callbacks = new ApiProductsController(Shop);

// create
//app.post("/", expressJwt({secret: CONF.app.jwt_secret}), exports.callbacks.create);

// read
app.get("/", exports.callbacks.list);