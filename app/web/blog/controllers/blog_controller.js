

var BlogController = function(blog) {

  this.list = function(req, res) {

    return blog.archive({status:'draft'},function(err, results){
      if (err) { throw err; }

      var context = {
        blog_title: "This is my blog",
        posts: results
      }
      
      var template = '../app/web/blog/views/list';
      res.render(template, context);

    });
      
  };

  this.show = function (req, res) {
    // body...
  }

};

module.exports = BlogController;