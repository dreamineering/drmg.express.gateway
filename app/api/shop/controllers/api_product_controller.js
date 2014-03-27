

var ApiProductController = function(Shop) {

  this.list = function(req, res) {

      return Shop.productList({status:'draft'},function(err, results){
        if (err) { throw err; }
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

module.exports = ApiProductController;