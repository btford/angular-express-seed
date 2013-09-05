/*jslint node:true, nomen:true */
var fs = require('fs'), _ = require('lodash'), async = require('async'), PATH = './lang/mail', EXPIRY = 60, path = PATH, mails;

// keep a cache of mails
mails = {};

module.exports = {
	init : function (p) {
		path = p || PATH;
	},
	get : function (type,lang,callback) {
		// build our list from most specific to least-specific
		var now = new Date().getTime(), found = false, list = _.reduce(
				(lang||"").split('_'),
				function(result,item){
					result.push(  result.length === 0 ? item : [].concat(result[result.length-1],item).join("_") ); 
					return(result);},
				[]).reverse();
		// default case
		list.push("");
		
		// need to get the mail from filesystem if not cached already
		mails[type] = mails[type] || {};
		// look for each type in reverse order
		_.each(list,function (item) {
			if (mails[type][item] && mails[type][item].expired > now) {
				found = mails[type][item];
				return(false);
			}
		});
		// did we find an answer?
		if (found) {
			callback(null,found);
		} else {
			fs.readdir(path,function (err,files) {
				var actuals = [];
				if (err) {
					callback("missingmailfiles");
				} else {
					_.each(list,function (item) {
						var fileName = type+(item?'_'+item:''), txtName = fileName + '.txt';
						if (_.contains(files,fileName)) {
							actuals.push({name:item,path:path+'/'+fileName});
						} else if (_.contains(files,txtName)) {
							actuals.push({name:item,path:path+'/'+txtName});
						}
					});
					// actuals now contains the actual file names we have
					async.each(actuals,
						function(item,cb) {
							fs.readFile(item.path,'utf8',function (err,data) {
								if (data) {
									data = data.match(/^([^\n]*)\n[^\n]*\n((.|\n)*)/m);
									mails[type][item.name] = {
										subject: _.template(data[1]),
										content: _.template(data[2]),
										expired: now + EXPIRY*60*1000
									};
									cb();
								} else {
									cb();
								}
							});
						},
						function (err) {
							// there should be no errors, we should just be complete
							_.each(list,function (item) {
								if (mails[type][item] && mails[type][item].expired > now) {
									found = mails[type][item];
									return(false);
								}
							});
							// did we find an answer?
							callback(null,found);
						}
					);
				}
			});
		}
	},
	compile: function (type,lang,config,callback) {
		this.get(type,lang,function (err,res) {
			if (err) {
				callback(err);
			} else if (!res) {
				callback(null,null);
			} else {
				callback(res.subject(config),res.content(config));
			}
		});
	}
};