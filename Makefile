SHELL := /bin/sh

.PHONY: up down migrate seed dev build start test lint typecheck

up:
	docker compose -f infra/docker/docker-compose.yml up -d

down:
	docker compose -f infra/docker/docker-compose.yml down -v

migrate:
	pnpm prisma:migrate:dev

seed:
	pnpm seed

dev:
	pnpm dev

build:
	pnpm build

start:
	pnpm start

test:
	pnpm test

lint:
	pnpm lint

typecheck:
	pnpm typecheck

