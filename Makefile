install:
	npm ci

test:
	npx playwright test

install-browsers:
	npx playwright install --with-deps chromium

build:
	npm run build

lint:
	npm run lint

start:
	npx frontend-flight-booking-server start -s ./dist

ci: install lint install-browsers test