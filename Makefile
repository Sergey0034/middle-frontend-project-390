APP_URL ?= http://localhost:5173
export APP_URL

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

ci: install install-browsers build test-browser