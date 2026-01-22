.PHONY: dev build start test test\:e2e lint typecheck

dev:
	npm run dev

build:
	npm run build

start:
	npm run start

test:
	npm run test

test\:e2e:
	npm run test:e2e

lint:
	npm run lint

typecheck:
	npm run typecheck
