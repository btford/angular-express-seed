var should = require('should'),
  request = require('supertest'),
  spec = require('./specInit'),
  url = spec.url;

describe('api', function() {
	
  it('GET /api/name should return Bob', function(done) {

    request(spec.url)
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
