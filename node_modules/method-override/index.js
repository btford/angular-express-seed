/*!
 * Connect - methodOverride
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var methods = require('methods');

/**
 * Method Override:
 *
 * Provides faux HTTP method support.
 *
 * Pass an optional `key` to use when checking for
 * a method override, otherwise defaults to _\_method_.
 * The original method is available via `req.originalMethod`.
 *
 * @param {String} key
 * @return {Function}
 * @api public
 */

module.exports = function methodOverride(key){
  key = key || '_method';
  return function methodOverride(req, res, next) {
    var method
    var val

    req.originalMethod = req.originalMethod || req.method;

    // req.body
    if (req.body && typeof req.body === 'object' && key in req.body) {
      method = req.body[key]
      delete req.body[key]
    }

    // check X-HTTP-Method-Override
    val = req.headers['x-http-method-override']
    if (val) {
      // multiple headers get joined with comma by node.js core
      method = val.split(/ *, */)
    }

    if (Array.isArray(method)) {
      method = method[0]
    }

    // replace
    if (supports(method)) {
      req.method = method.toUpperCase()
    }

    next();
  };
};

/**
 * Check if node supports `method`.
 */

function supports(method) {
  return method
    && typeof method === 'string'
    && methods.indexOf(method.toLowerCase()) !== -1
}
