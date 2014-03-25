var should = require('should'),
  request = require('supertest'),
  spec = require('./specInit'),
  url = spec.url;

describe('index', function() {
	
  it('GET / should return status code 200', function(done) {

    request(url)
    .get('/')
    .send()
    .end(function(err, res) {
      if (err) {
        throw err;
      }
      res.statusCode.should.equal(200);
      done();
    });
  });

  it('GET /non_existent should return status code 200', function(done) {

    request(url)
    .get('/non_existent')
    .send()
    .end(function(err, res) {
      if (err) {
        throw err;
      }
      res.statusCode.should.equal(200);
      done();
    });
  });
});
