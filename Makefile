APP_URL ?= http://localhost:5173

test:
	npx playwwright test

install:
	npm ci

dev:
	npm run dev

build:
	npm run build

lint:
	npm run lint

ci: install dev test