
var ApiBlogController = function(blog) {

  this.list = function(req, res) {
    return blog.archive({status:'draft'},function(err, results){
      if (err) return next (err);
      return res.send(results);
    });

  };

  this.show = function (req, res) {
    // body...
  };

  this.create = function(req, res) {

    return blog.saveArticle(req.body, function(err, newArticle){
      if (err) {
        return res.send({ err: err }, 409);
      }
      return res.send(newArticle);
    });

  };

  this.update = function(req, res) {

  };

  this.delete = function(req, res) {

  }

};

module.exports = ApiBlogController;