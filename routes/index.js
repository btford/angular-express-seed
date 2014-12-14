
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

exports.userinfo = function(req, res){
    // this sends off the user object that we've returned from db.
    console.log('sending user info: ', req.user)
    res.send(req.user)
}

// this ensures on each route that we're authenticated, it will show the next route, or redirect us to login
exports.ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
}