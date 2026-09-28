APP_URL ?= http://localhost:5173
export APP_URL

test:
	npx playwright test

install:
	npm ci

dev:
	npm run dev

build:
	npm run build

lint:
	npm run lint

ci: install dev test