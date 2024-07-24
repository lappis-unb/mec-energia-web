ENV_PROD=.envs/.env.prod
ENV_DEV=.envs/.env.dev
COMPOSE_FILE_PROD=compose.prod.yml
COMPOSE_FILE_DEV=compose.dev.yml

build-dev:
	docker compose -f $(COMPOSE_FILE_DEV) --env-file $(ENV_DEV) build

build-prod:
	docker compose -f $(COMPOSE_FILE_PROD) --env-file $(ENV_PROD) build

up-dev:
	docker compose -f $(COMPOSE_FILE_DEV) --env-file $(ENV_DEV) up -d

up-prod:
	docker compose -f $(COMPOSE_FILE_PROD) --env-file $(ENV_PROD) up -d	

down-dev:
	docker compose -f $(COMPOSE_FILE_DEV) --env-file $(ENV_DEV) down

down-prod:
	docker compose -f $(COMPOSE_FILE_PROD) --env-file $(ENV_PROD) down
