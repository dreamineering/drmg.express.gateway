
var _           = require('lodash');
var request     = require('request');
var CONF        = require('config');

var Shop = function(){

  var _productList = function(criteria, cb){
    criteria = criteria || {};
    var options = {
      url: CONF.ecommerce.host + CONF.ecommerce.port + '/api/products',
      headers: {
        'X-Spree-Token' : CONF.ecommerce.key
      }
    };
    request(options, function (err, res, body) {
      if (err) return cb(err);
      return cb(null,JSON.parse(body));
    });
  }

  return {
    productList : _productList
  }

}();


module.exports = Shop;