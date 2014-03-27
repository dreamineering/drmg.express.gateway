
var io          = {};
var  fs         = require('fs');
var  _          = require('lodash');
var  request    = require('request');
var  snapshot   = require('node-snapshot');
var  CONF       = require('config');

/**
 * @property url
 * @type {String}
 */
var options = {
  url: CONF.ecommerce.host + CONF.ecommerce.port + '/api/products',
  headers: {
    'X-Spree-Token': CONF.ecommerce.key
  }
};


/**CONF.app.port
 * @property products
 * @type {String}
 */
var products = '';

// Retrieve the products so we'll always have a fresh copy to serve to
// new connections.
request(options, function (error, response, body) {
  products = JSON.parse(body);
  io = require('socket.io').listen(parseInt(CONF.socket.port));
  beginListening();
});


/**
 * @method beginListening
 * @return {void}
 */
var beginListening = function beginListening() {

  /**
  * @on connection
  */
  io.sockets.on('connection', function (socket) {

    // Bootstrap Snapshot passing in the reference for the socket as a dependency.
    var $snapshot = new snapshot('products').bootstrap(socket).useDelta(true);

    // Configure the defaults.
    $snapshot.setPageNumber(1);
    $snapshot.setPerPage(15);
    $snapshot.setSortBy('name', 'asc');
    $snapshot.setRanges(['price']);
    $snapshot.setGroups(['manufacturer', 'colour']);
    $snapshot.setCollection(products, ['id', 'name', 'colour', 'price', 'manufacturer']);

    socket.on('snapshot/products/colours', function colours(ids) {
      $snapshot.applyFilter('colour', function colour(colourDimension) {
        colourDimension.filterFunction(function(d) {
          return (d === 0) || _.contains(ids, d);
        });
      }, 'afresh');
    });

    socket.on('snapshot/products/manufacturers', function manufacturers(ids) {
      $snapshot.applyFilter('manufacturer', function manufacturer(manufacturerDimension) {
        manufacturerDimension.filterFunction(function(d) {
          return (d === 0) || _.contains(ids, d);
        });
      }, 'afresh');
    });

    socket.on('disconnect', function() {
      // $snapshot = undefined;
    });

  });

};

// FULL CREDIT
// https://github.com/Wildhoney/Magento-on-Angular
