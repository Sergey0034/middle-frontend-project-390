install:
	npm install

test-playwright:
	npx playwright test

install-browsers:
	npx playwright install --with-deps

build:
	npm run build

test:
	install-browsers test-playwright

start:
	npx frontend-flight-booking-server start -s ./dist

ci: install test

.PHONY: ci