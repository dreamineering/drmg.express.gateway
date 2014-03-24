

var Blog = require('../content_chunks');

var blog = {};
var conf = {
  db: {
    articles : './data/blogArticles.db'
  }
};

Blog.init(conf, function(err, configured){
  blog = configured;
});


exports.blog = blog;