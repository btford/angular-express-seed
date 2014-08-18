var domain = require('domain');

module.exports = function () {
	return function domainMiddleware(req, res, next) {
		var reqDomain = domain.create();

		res.on('close', function () {
			reqDomain.dispose();
		});

		res.on('finish', function () {
			reqDomain.dispose();
		});

		reqDomain.on('error', function (err) {
			// Once a domain is disposed, further errors from the emitters in that set will be ignored.
			reqDomain.dispose();
			next(err);
		});

		reqDomain.run(next);
	};
};
