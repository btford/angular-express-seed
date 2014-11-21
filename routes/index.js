
/*
 * GET home page.
 */

exports.index = function(req, res){
    console.log('calling index')
  res.render('index', { user: req.user })
}

exports.partials = function (req, res) {
  var name = req.params.name
  console.log("name == " + name)
  res.render('partials/' + name, { user: req.user })
}