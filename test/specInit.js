/* 
 * Server-side tests configuration and init
 */

var	app = require(__dirname + '/../app.js'),
  host = 'http://localhost',
  port = app.get('port'),

	// base url for all test requests	
	url = host + ':' + port;
	
	exports.url = url;
