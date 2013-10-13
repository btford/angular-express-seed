/*jslint node:true, nomen:true, debug:true */
/*global should, describe, before, beforeEach, it, escape */

var request = require('supertest'), should = require('should'), express = require('express'), 
app = express(), _ = require('lodash'), async = require('async'), smtp = require('smtp-tester'),
r = request(app), mail,
activator = require('../lib/activator'), templates = __dirname+'/resources',
USERS = {
	"1": {id:"1",email:"me@you.com",password:"1234"}
},
users,
userModel = {
	_find: function (login,cb) {
		var found = null;
		if (!login) {
			cb("nologin");
		} else if (users[login]) {
			cb(null,_.cloneDeep(users[login]));
		} else {
			_.each(users,function (val) {
				if (val && val.email === login) {
					found = val;
					return(false);
				}
			});
			cb(null,_.cloneDeep(found));
		}
	},
	find: function() {
		this._find.apply(this,arguments);
	},
	save: function (id,model,cb) {
		if (id && users[id]) {
			_.extend(users[id],model);
			cb(null);
		} else {
			cb(404);
		}
	}
}, 
reset = function () {
	users = _.cloneDeep(USERS);
	if (mail && mail.removeAll) {
		mail.removeAll();
	}
},
userModelEmail = _.extend({},userModel,{find: function (login,cb) {
	this._find(login,function (err,res) {
		if (res && res.email) {
			res.funny = res.email;
			delete res.email;
		}
		cb(err,res);
	});
	}
}),
MAILPORT = 30111,
url = "smtp://localhost:"+MAILPORT+"/gopickup.net/"+escape("GoPickup Test <test@gopickup.net>"),
createUser = function (req,res,next) {
	users["2"] = {id:"2",email:"you@me.com",password:"5678"};
	req.activator = {id:"2",body:"2"};
	next();
},
genHandler = function(email,cb,subject,path) {
	return function(rcpt,msgid,content) {
		var url, ret, re = new RegExp('http:\\/\\/\\S*'+path.replace(/\//g,'\\/')+'\\?code=([^\\s\\&]+)\\&email=(\\S+)\\&user=([^\\s\\&]+)');
		rcpt.should.eql(email);
		// check for the correct Subject in the email
		should.exist(content.data);
		content.headers.Subject.should.eql(subject);
		should.exist(content.body);
		/*jslint regexp:true */
		url = content.body.match(re);
		/*jslint regexp:false */
		should.exist(url);
		// check that code and email match what is in database
		url.length.should.eql(4);
		ret = _.object(["path","code","email","user"],url);
		ret.email.should.eql(email);
		cb(null,ret);
	};
},
aHandler = function (email,cb) {
	return genHandler(email,cb,"Activate Email","/activate/my/account");
},
rHandler = function(email,cb) {
	return genHandler(email,cb,"Password Reset Email","/reset/my/password");
};


before(function(){
  debugger;
});

before(function(){
  reset();
});

describe('activator', function(){
	before(function(){
	  mail = smtp.init(MAILPORT);		
		app.use(express.bodyParser());
		app.use(app.router);
		app.post('/usersbad',activator.createActivate);
		app.post('/users',createUser,activator.createActivate);
		app.put('/users/:user/activate',activator.completeActivate);
		app.post('/passwordreset',activator.createPasswordReset);
		app.put('/passwordreset/:user',activator.completePasswordReset);
	});
	describe('not initialized', function(){
    it('activate should send 500', function(done){
			r.post('/users').type("json").send({name:"john"}).expect(500,done);
    });
    it('completeactivate should send 500', function(done){
			r.put('/users/1/activate').type("json").send({code:"12345"}).expect(500,done);
    });
    it('passwordreset should send 500', function(done){
			r.post('/passwordreset').type("json").send({name:"john"}).expect(500,done);
    });
    it('completepasswordreset should send 500', function(done){
			r.put('/passwordreset/1').type("json").send({password:"abcd",code:"12345"}).expect(500,done);
    });
	});
	describe('initialized', function(){
		before(function(){
		  activator.init({user:userModel,url:url,templates:templates});
		});
		beforeEach(reset);
	  describe('activate', function(){
			it('should send 500 for user property not added', function(done){
				r.post('/usersbad').expect(500,done);
			});
			it('should fail for known user but bad code', function(done){
				var email, handler;
				async.waterfall([
					function (cb) {r.post('/users').expect(201,cb);},
					function (res,cb) {
						email = users["2"].email;
						handler = aHandler(email,cb);
						mail.bind(email,handler);
					},
					function (res,cb) {
						mail.unbind(email,handler);
						r.put('/users/'+res.user+'/activate').type("json").send({code:"asasqsqsqs"}).expect(400,cb);
					}
				],done);
			});
			it('should succeed for known user', function(done){
				var email, handler;
				async.waterfall([
					function (cb) {r.post('/users').expect(201,cb);},
					function (res,cb) {
						res.text.should.equal("2");
						email = users["2"].email;
						handler = aHandler(email,cb);
						mail.bind(email,handler);
					},
					function (res,cb) {
						mail.unbind(email,handler);
						r.put('/users/'+res.user+'/activate').type("json").send({code:res.code}).expect(200,cb);
					}
				],done);
			});
	  });
		describe('password reset', function(){
		  it('should send 400 for no email or ID passed', function(done){
				r.post("/passwordreset").expect(400,done);
		  });
		  it('should send 404 for unknown email or ID', function(done){
				r.post("/passwordreset").type('json').send({user:"john@john.com"}).expect(404,done);
		  });
			it('should fail for known email but bad code', function(done){
				var email = users["1"].email, handler;
				async.waterfall([
					function (cb) {
						r.post('/passwordreset').type('json').send({user:email}).expect(201,cb);},
					function (res,cb) {
						handler = rHandler(email,cb);
						mail.bind(email,handler);},
					function (res,cb) {
						mail.unbind(email,handler);
						r.put('/passwordreset/'+res.user).type("json").send({code:"asasqsqsqs",password:"asasa"}).expect(400,cb);
					}
				],done);
			});
			it('should fail for known email with good code but missing new password', function(done){
				var email = users["1"].email, handler;
				async.waterfall([
					function (cb) {r.post('/passwordreset').type('json').send({user:email}).expect(201,cb);},
					function (res,cb) {handler = rHandler(email,cb); mail.bind(email,handler);},
					function (res,cb) {
						mail.unbind(email,handler);
						r.put('/passwordreset/'+res.user).type("json").send({code:res.code}).expect(400,cb);
					}
				],done);
			});
			it('should fail for expired reset code', function(done){
				var user = users["1"], email = user.email, handler;
				async.waterfall([
					function (cb) {r.post('/passwordreset').type('json').send({user:"1"}).expect(201,cb);},
					function (res,cb) {handler = rHandler(email,cb); mail.bind(email,handler);},
					function (res,cb) {
						mail.unbind(email,handler);
						user.password_reset_time = 100;
						r.put('/passwordreset/'+res.user).type("json").send({code:res.code,password:"abcdefgh"}).expect(400,cb);
					}
				],done);
			});
			it('should succeed for known ID', function(done){
				var email = users["1"].email, handler;
				async.waterfall([
					function (cb) {r.post('/passwordreset').type('json').send({user:"1"}).expect(201,cb);},
					function (res,cb) {handler = rHandler(email,cb); mail.bind(email,handler);},
					function (res,cb) {
						mail.unbind(email,handler);
						r.put('/passwordreset/'+res.user).type("json").send({code:res.code,password:"abcdefgh"}).expect(200,cb);
					}
				],done);
			});
			it('should succeed for known email', function(done){
				var email = users["1"].email, handler;
				async.waterfall([
					function (cb) {r.post('/passwordreset').type('json').send({user:email}).expect(201,cb);},
					function (res,cb) {handler = rHandler(email,cb); mail.bind(email,handler);},
					function (res,cb) {
						mail.unbind(email,handler);
						r.put('/passwordreset/'+res.user).type("json").send({code:res.code,password:"abcdefgh"}).expect(200,cb);
					}
				],done);
			});
		});
		describe('with email property override', function(){
			before(function(){
			  activator.init({user:userModelEmail,emailProperty:"funny",url:url,templates:templates});
			});		  
			it('activate should succeed for known user', function(done){
				var email, handler;
				async.waterfall([
					function (cb) {r.post('/users').expect(201,cb);},
					function (res,cb) {
						res.text.should.equal("2");
						email = users["2"].email;
						handler = aHandler(email,cb);
						mail.bind(email,handler);
					},
					function (res,cb) {
						mail.unbind(email,handler);
						r.put('/users/'+res.user+'/activate').type("json").send({code:res.code}).expect(200,cb);
					}
				],done);
			});
			it('password reset should succeed for known email', function(done){
				var email = users["1"].email, handler;
				async.waterfall([
					function (cb) {r.post('/passwordreset').type('json').send({user:email}).expect(201,cb);},
					function (res,cb) {handler = rHandler(email,cb); mail.bind(email,handler);},
					function (res,cb) {
						mail.unbind(email,handler);
						r.put('/passwordreset/'+res.user).type("json").send({code:res.code,password:"abcdefgh"}).expect(200,cb);
					}
				],done);
			});
		});
	});
});