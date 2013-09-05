REPORTER = spec
TESTS = test/*.js

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--ui bdd \
		$(TESTS)

.PHONY: test
