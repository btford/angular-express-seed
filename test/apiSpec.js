var	app = require(__dirname + '/../app.js'),
	assert  = require('assert'),
  	should = require('should'),
  	request = require('supertest'),
  	url = 'http://localhost:3000';

describe('api', function() {
	
  	it('GET /api/name should return Bob', function(done) {
    	
    	request(url)
			.get('/api/name')
			.send()
    		.end(function(err, res) {
          		if (err) {
            		throw err;
          		}
          		
          		res.body.name.should.equal('Bob');
          		done();
        	});
    });
});
