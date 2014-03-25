describe('services', function() {

	describe('version', function() {
		var vers;

		beforeEach(module('myApp.services'));
		
		beforeEach(inject(function(version) {
			vers = version;
		}));

		describe('version', function() {
	    	it('should return current version', function() {
	      		expect(vers).toEqual('0.1');
	    	});
	  	});
		
	});
});
