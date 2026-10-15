install:
	npm ci

test-browser:
	npx playwright test

install-browsers:
	npx playwright install --with-deps

build:
	npm run build

start:
	npx frontend-flight-booking-server start -s ./dist

ci: install install-browsers test-browser build start

.PHONY: install install-browsers test-browser build start ci