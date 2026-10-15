test-browser:
	npx playwright test

install:
	npm ci

install-browsers:
	npx playwright install --with-deps

dev:
	npm run dev

build:
	npm run build

lint:
	npm run lint

start:
	npx frontend-flight-booking-server start -s ./dist

ci: install install-browsers build test-browser start