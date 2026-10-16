install:
	npm ci

test:
	npx playwright test

install-browsers:
	npx playwright install --with-deps

build:
	npm run build

start:
	npx frontend-flight-booking-server start -s ./dist

ci: install install-browsers test