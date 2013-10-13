/*jslint node:true, nomen:true */
/*global escape */

// with defaults
var async = require('async'), crypto = require('crypto'), smtp = require('./mailer'), mailer,
sha1 = function (msg) {
	return crypto.createHash('sha1').update(msg).digest('hex');
},
model = {find: function(user,cb){cb("uninitialized");}, save: function(id,data,cb){cb("uninitialized");}}, 
url = "smtp://localhost:465/activator.net/"+escape("help@activator.net"), 
templates = __dirname+'/templates',
emailProperty = "email",
resetExpire = 60, proto = "https://";

module.exports = {
	init: function (config) {
		model = config.user || model;
		url = config.url || url;
		templates = config.templates || templates;
		resetExpire = config.resetExpire || resetExpire;
		proto = config.protocol || proto;
		mailer = smtp(url,templates);
		emailProperty = config.emailProperty || emailProperty;
	},
	createPasswordReset: function (req,res,next) {
		var reset_code, reset_time, email, id;
		/*
		 * process:
		 * 1) get the user by email
		 * 2) create a random reset code
		 * 3) save it
		 * 4) send an email
		 */
		async.waterfall([
			function (cb) {model.find(req.param("user"),cb);},
			function (res,cb) {
				if (!res || res.length < 1) {
					cb(404);
				} else {
					email = res[emailProperty];
					id = res.id;
					reset_time = new Date().getTime() + resetExpire*60*1000;
					reset_code = sha1(email + new Date().toString().split("").sort(function(){return Math.round(Math.random())-0.5;})).substr(0,8);
					// we just need the first 8 chars, any random code is fine
					// expires in 60 minutes
					// save the update
					model.save(id,{password_reset_code:reset_code,password_reset_time:reset_time},cb);
				}
			},
			function(res,cb) {
				if (!cb && typeof(res) === "function") {
					cb = res;
				}
				mailer("passwordreset","en_US",{code:reset_code,email:email,id:id,request:req},email,cb);
			}
		],function (err) {
			var code = 400;
			if (err) {
				if (typeof(err) === 'number') {
					code = err;
				} else if (err === "uninitialized" || err === "baddb") {
					code = 500;
				}
				res.send(code,err);
			} else {
				res.send(201);
			}
		});
	},
	completePasswordReset: function (req,res,next) {
		var reset_code = req.param("code"), password = req.param("password"), id = req.param("user"), now = new Date().getTime();
		async.waterfall([
			function (cb) {model.find(id,cb);},
			function (res,cb) {
				if (!res) {
					cb(404);
				} else if (res.password_reset_code !== reset_code){
					cb("invalidresetcode");
				} else if (res.password_reset_time < now) {
					cb("expiredresetcode");
				} else if (!password) {
					cb("missingpassword");
				} else {
					model.save(id,{password_reset_code:"X",password_reset_time:0,password:password},cb);
				}
			}
		],function (err) {
			var code = 400;
			if (err) {
				if (err === 404) {
					code = 404;
				} else if (err === "uninitialized") {
					code = 500;
				}
				res.send(code,err);
			} else {
				res.send(200);
			}
		});
	},
	createActivate: function (req,res,next) {
		// add the activation code, just a randomization of this very moment, plus the email, hashed together
		var email, id = (req.activator?req.activator.id:null) || (req.user?req.user.id:null), code;
		if (!id) {
			res.send(500,"uninitialized");
		} else {
			code = sha1(email + new Date().toString().split("").sort(function(){return Math.round(Math.random())-0.5;})).substr(0,8);
			async.waterfall([
				function(cb) {
					model.find(id,cb);
				},
				function(res,cb){
					if (!res) {
						cb(404);
					} else {
						email = res[emailProperty];
						model.save(id,{activation_code:code},cb);
					}
				},
				function(res,cb) {
					if (!cb && typeof(res) === "function") {
						cb = res;
					}
					mailer("activate","en_US",{code:code,email:email,id:id,request:req},email,cb);
				}
			],function (err) {
				var code = 400;
				if (err) {
					if (err === 404) {
						code = 404;
					} else if (err === "uninitialized") {
						code = 500;
					}
					res.send(code,err);
				} else {
					res.send(201,req.activator?req.activator.body:undefined);
				}
			});
		}
	},
	completeActivate: function (req,res,next) {
		var code = req.param("code"), id = req.param("user");

		async.waterfall([
			function (cb) {model.find(id,cb);},
			function (res,cb) {
				if (!res) {
					cb(404);
				} else if (res.activation_code !== code){
					cb("invalidcode");
				} else {
					model.save(id,{activation_code:"X"},cb);
				}
			}
		],function (err) {
			var code = 400;
			if (err) {
				if (err === 404) {
					code = 404;
				} else if (err === "uninitialized") {
					code = 500;
				}
				res.send(code,err);
			} else {
				res.send(200);
			}
		});
	}	
};