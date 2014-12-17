
/**
 * Module dependencies
 */

var express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  //errorHandler = require('error-handler'),
  morgan = require('morgan'),
  passport = require('passport'),
  routes = require('./routes'),
  api = require('./routes/api'),
  http = require('http'),
  https = require('https'),
  path = require('path'),
  // the requires for passport
  LocalStrategy = require('passport-local').Strategy,
  flash = require('connect-flash'),
  session = require('express-session'),
  bcrypt = require('bcryptjs'),
  sift = require('sift'),
  fs = require('fs'),
  mongo = require('mongoskin'),
  db = mongo.db("mongodb://localhost/registration", {safe : true})

var options = {
    key : fs.readFileSync('./ssl/privatekey'),
    cert : fs.readFileSync('./ssl/certificate')
}

// for passport session management
var users = []

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
    done(null, user.id);
})

passport.deserializeUser(function(id, done) {
    var returnedUserObject = sift({'id' : id}, users)
    if(returnedUserObject.length === 1){
        return done(null, returnedUserObject)
    } else {
        return done(new Error('user does not exist for id:', id))
    }
})


// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
    function(username, password, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {

            // Find the user by username.  If there is no user with the given
            // username, or the password is not correct, set the user to `false` to
            // indicate failure and set a flash message.  Otherwise, return the
            // authenticated `user`.
            db.collection('users').findOne({'userName' : username}, function(err, userObject){
                if(err){
                    return done(err)
                }
                if(userObject){

                    if(bcrypt.compareSync(password, userObject.password)){

                        // for passport sessions
                        userObject.id = userObject._id
                        users.push(userObject)
                        return done(null, userObject)
                    } else {
                        return done(null, false, { message: 'Invalid Password'})
                    }

                } else {
                    return(done(null, false, {message : 'Unknown user ' + username}))
                }
            })

        })
    }
))


var app = module.exports = express()

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 8000)
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(morgan('dev'))
app.use(bodyParser())
app.use(methodOverride())
app.use(express.static(path.join(__dirname, 'public')))
// session and setup for passport
app.use(session({ secret: 'imalittleteapot' }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

var env = process.env.NODE_ENV || 'development';

// development only
if (env === 'development') {
  app.use(express.errorHandler())
}

// production only
if (env === 'production') {
  // TODO
}


/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.ensureAuthenticated, routes.index)
app.get('/partials/:name', routes.ensureAuthenticated, routes.partials)
// I don't know where to put this.
app.get('/api/userinfo', routes.ensureAuthenticated, routes.userinfo)


// login stuff
app.get('/login', function(req, res){

    res.render('login')
})
app.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), function(req, res) {
    // this happens on success
    res.redirect('/')
})

// JSON API
//TODO: decide if the API should be protected to, and under what circumstances.
app.get('/api/name', api.name)
app.get('/api/watable_data',api.watable_data)


// redirect all others to the index (HTML5 history)
app.get('*', routes.ensureAuthenticated, routes.index)


/**
 * Start Server
 */


//TODO: this needs to be worked out, ALL connections should move to secure, including in angular
//https.createServer(options, app).listen(app.get('port'), function () {
http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'))
})
