'use strict';

var restify = require('restify'),
  server = restify.createServer(),
  errorHandler = require('../error-handler.js'),

  handleError = errorHandler({
    server: server,

    // Put the errorHandler in restify error
    // handling mode.
    framework: 'restify'
  }),

  // Since restify error handlers take error
  // last, and process 'uncaughtError' sends
  // error first, you'll need another one for
  // process exceptions. Don't pass the
  // framework: 'restify' setting this time:
  handleProcessError = errorHandler({
    server: server
  }),

  middlewareError =
      function middlewareError() {
    throw new Error('Random middleware error.');
  };

// Don't do this:
server.get('/brokenError', function (req, res, next) {
  var err = new Error('Random, possibly ' +
    'unrecoverable error. Server is now running ' +
    'in undefined state!');

  err.status = 500;

  // Warning! This error will go directly to the
  // user, and you won't have any opportunity to
  // examine it and possibly shut down the system.
  next(err);
});

// Instead, do this:
server.get('/err', function (req, res) {
  var err = new Error('Random, possibly ' +
    'unrecoverable error. Server is now running ' +
    'in undefined state!');

  err.status = 500;

  // You should invoke handleError directly in your
  // route instead of sending it to next() or 
  // throwing. Note that the restify error handler
  // has the call signature: req, res, route, err.
  // Normally, route is an object.
  handleError(req, res, '/err', err);
});


// This route demonstrates what happens when your
// routes throw. Never do this on
// purpose. Instead, invoke the
// error handler as described above.
server.get('/thrower', function () {
  var err = new Error('Random, possibly ' +
    'unrecoverable error. Server is now running ' +
    'in undefined state!');

  throw err;
});

// This demonstrates what happens when your
// middleware throws. As with routes, never do
// this on purpose. Instead, invoke the
// error handler as described above.
server.use(middlewareError);

server.get('/middleware', function () {
  // Placeholder to invoke middlewareError.
});

// This is called when an error is accidentally
// thrown. Under the hood, it uses Node's domain
// module for error handling, which limits the
// scope of the domain to the request / response
// cycle. Restify hooks up the domain for you,
// so you don't have to worry about binding
// request and response to the domain.
server.on('uncaughtException', handleError);

// We should still listen for process errors
// and shut down if we catch them. This handler
// will try to let server connections drain, first,
// and invoke your custom handlers if you have
// any defined.
process.on('uncaughtException', handleProcessError);

server.listen(3000, function () {
  console.log('Listening on port 3000');
});
