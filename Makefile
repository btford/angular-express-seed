test:
	@./node_modules/.bin/mocha -u bdd

test-client:
	@./node_modules/karma/bin/karma start ./test/client/unit/karma.config.js

.PHONY: test test-client
	