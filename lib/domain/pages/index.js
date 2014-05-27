

var Page = require('../content_chunks');

var minty = {};
var conf = {
  db: {
    pages : './data/pages.db'
    //content_chunks : './data/content_chunks.db'
  }
};

Pages.init(conf, function(err, configured){
  pages = configured;
});


exports.pages = pages;