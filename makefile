test:
	DEBUG= ./node_modules/.bin/mocha -R spec -t 5000

test-debug:
	DEBUG=coinbase* ./node_modules/.bin/mocha -R spec -t 5000

test-docs:
	DEBUG=coinbase* ./node_modules/.bin/mocha -R doc -t 5000 > docs.html

test-markdown:
	DEBUG=coinbase* ./node_modules/.bin/mocha -R markdown -t 5000 > docs.md

.PHONY: test
