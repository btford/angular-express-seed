
/*!
 * mongoose-user
 * Copyright(c) 2013 Madhusudhan Srinivasa <madhums8@gmail.com>
 * MIT Licensed
 */

/**
 * Expose
 */

module.exports = userPlugin

/**
 * User plugin
 *
 * Some common methods and statics to user schema
 *
 * @param {Schema} schema
 * @param {Object} options
 * @api public
 */

function userPlugin (schema, options) {
  var crypto = require('crypto')

  /**
   * Authenticate by checking the hashed password and provided password
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api private
   */

  schema.methods.authenticate = function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  }

  /**
   * Create password salt
   *
   * @return {String}
   * @api private
   */

  schema.methods.makeSalt = function() {
    return Math.round((new Date().valueOf() * Math.random())) + ''
  }

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api private
   */

  schema.methods.encryptPassword = function (password) {
    if (!password) return ''
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
  }

  /**
   * Reset auth token
   *
   * @param {String} token
   * @param {Function} cb
   * @api private
   */

  schema.methods.resetToken = function (token, cb) {
    var self = this
    crypto.randomBytes(48, function(ex, buf) {
      self[token] = buf.toString('hex')
      if (cb) cb()
    })
  }

  /**
   * Statics
   */

  /**
   * Load
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  schema.statics.load = function (options, cb) {
    var criteria = options.criteria || {}

    this.findOne(criteria)
      .exec(cb)
  }

  /**
   * List
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  schema.statics.list = function (options, cb) {
    var criteria = options.criteria || {}
    var sort = options.sort || { createdAt: -1 }
    var limit = options.limit === 0 ? 0 : (options.limit || 10)
    var page = options.page || 0

    this.find(criteria)
      .select('name username email')
      .sort(sort)
      .limit(limit)
      .skip(limit * page)
      .exec(cb)
  }

  /**
   * Virtuals
   */

  /**
   * Password virtual
   */

  schema.virtual('password')
  .set(function(password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function() {
    return this._password
  })

  /**
   * Skip validation virtual.
   *
   * If skipValidation attribute is set to true, validations won't be performed
   */

  schema.virtual('skipValidation')
  .set(function(val) {
    this._skipValidation = val
  })
  .get(function() {
    return this._skipValidation
  })

  /**
   * Validations
   */

  schema.path('name').validate(function (name) {
    if (this.skipValidation) return true
    return name.trim().length
  }, 'Please provide a valid name')

  schema.path('email').validate(function (email) {
    if (this.skipValidation) return true
    return email.trim().length
  }, 'Please provide a valid email')

  schema.path('hashed_password').validate(function (hashed_password) {
    if (this.skipValidation) return true
    return hashed_password.length
  }, 'Please provide a password')
}
