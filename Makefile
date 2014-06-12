
test:
	@./node_modules/.bin/mocha \
		--require should \
		--reporter dot \
		--timeout 5s \
		--bail

.PHONY: test