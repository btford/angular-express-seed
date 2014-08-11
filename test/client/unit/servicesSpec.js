describe('services', function() {

	beforeEach(module('myApp.services'));

	describe('version', function() {
		var vers;
	
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
