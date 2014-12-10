
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
  path = require('path'),
  // the requires for passport
  LocalStrategy = require('passport-local').Strategy,
  flash = require('connect-flash'),
  session = require('express-session')



var users = [
    { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' }
    , { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' }
];

function findById(id, fn) {
    var idx = id - 1;
    if (users[idx]) {
        fn(null, users[idx]);
    } else {
        fn(new Error('User ' + id + ' does not exist'));
    }
}

function findByUsername(username, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
        var user = users[i];
        if (user.username === username) {
            return fn(null, user);
        }
    }
    return fn(null, null);
}


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    findById(id, function (err, user) {
        done(err, user);
    });
});


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
            findByUsername(username, function(err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
                if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
                return done(null, user);
            })
        });
    }
));


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
    console.log('should login')
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

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'))
})
