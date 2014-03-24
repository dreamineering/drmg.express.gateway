exports = module.exports;

exports.home = function(req, res) {

  var name = req.param('name', '');

  var context = {
    site_title: "Dreamineering",
    welcome_message: 'Welcome to dreamineering'
  }

  var template = '../app/web/pages/views/home';
  res.render(template, context);

};