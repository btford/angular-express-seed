
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index')
}

exports.partials = function (req, res) {
  var name = req.params.name
  console.log("name == " + name)
  res.render('partials/' + name)
}