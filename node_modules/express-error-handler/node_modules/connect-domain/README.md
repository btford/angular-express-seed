# About 

Asynchronous error handler for Connect

# Installation

	npm install connect-domain

# Usage

```js
var
	connect = require('connect'),
	connectDomain = require('connect-domain');

var app = connect()
	.use(connectDomain())
	.use(function(req, res){
		if (Math.random() > 0.5) {
			throw new Error('Simple error');
		}
		setTimeout(function() {
			if (Math.random() > 0.5) {
				throw new Error('Asynchronous error from timeout');
			} else {
				res.end('Hello from Connect!');
			}
		}, 1000);
	})
	.use(function(err, req, res, next) {
		res.end(err.message);
	});

app.listen(3000);
```