install:
	npm ci

test:
	npx playwright test

install-browsers:
	npx playwright install --with-deps chromium

build:
	npm run build

start:
	npx frontend-flight-booking-server start -s ./dist

start-back:
	npx frontend-flight-booking-server start

ci: install install-browsers start-back test