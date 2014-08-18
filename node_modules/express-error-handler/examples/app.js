'use strict';

var express = require('express'),
  logger = require('bunyan-request-logger'),
  noCache = require('connect-cache-control'),
  errorHandler = require('../error-handler.js'),
  log = logger(),
  app = express(),
  env = process.env,
  port = env.myapp_port || 3000,
  http = require('http'),
  server;

app.use( log.requestLogger() );

// Route to handle client side log messages.
//
// Counter to intuition, client side logging
// works best with GET requests.
// 
// AJAX POST sends headers and body in two steps,
// which slows it down.
// 
// This route prepends the cache-control
// middleware so that the browser always logs
// to the server instead of fetching a useless
// OK message from its cache.
app.get('/log', noCache,
    function logHandler(req, res) {

  // Since all requests are automatically logged,
  // all you need to do is send the response:
  res.send(200);
});

// Route that triggers a sample error:
app.get('/error', function createError(req,
    res, next) {
  var err = new Error('Sample error');
  err.status = 500;
  next(err);
});


// Route that triggers a sample error:
app.all('/*', errorHandler.httpError(404));

// Log request errors:
app.use( log.errorLogger() );

// Create the server object that we can pass
// in to the error handler:
server = http.createServer(app);

// Respond to errors and conditionally shut
// down the server. Pass in the server object
// so the error handler can shut it down
// gracefully:
app.use( errorHandler({server: server}) );

server.listen(port, function () {
  log.info('Listening on port ' + port);
});
