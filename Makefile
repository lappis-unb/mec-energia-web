ENV_PROD=.envs/.env.prod
ENV_DEV=.envs/.env.dev
ENV_TEST=.envs/.env.test
COMPOSE_FILE_PROD=compose.prod.yml
COMPOSE_FILE_DEV=compose.dev.yml
COMPOSE_FILE_TEST=compose.test.yml

build:
	docker compose -f $(COMPOSE_FILE_DEV) --env-file $(ENV_DEV) build

build-nc:
	docker compose -f $(COMPOSE_FILE_DEV) --env-file $(ENV_DEV) build --no-cache --force-rm

build-up:
	docker compose -f $(COMPOSE_FILE_DEV) --env-file $(ENV_DEV) up --build -d --remove-orphans
up:
	docker compose -f $(COMPOSE_FILE_DEV) --env-file $(ENV_DEV) up -d --remove-orphans
down:
	docker compose -f $(COMPOSE_FILE_DEV) --env-file $(ENV_DEV) down
build-prod:
	docker compose -f $(COMPOSE_FILE_PROD) --env-file $(ENV_PROD) build
build-nc-prod:
	docker compose -f $(COMPOSE_FILE_PROD) --env-file $(ENV_PROD) build --no-cache --force-rm
up-prod:
	docker compose -f $(COMPOSE_FILE_PROD) --env-file $(ENV_PROD) up -d --remove-orphans
down-prod:
	docker compose -f $(COMPOSE_FILE_PROD) --env-file $(ENV_PROD) down

# Temp: testes com backend remoto
build-test:
	docker compose -f $(COMPOSE_FILE_TEST) --env-file $(ENV_TEST) build
build-nc-test:
	docker compose -f $(COMPOSE_FILE_TEST) --env-file $(ENV_TEST) build --no-cache --force-rm
build-up-test:
	docker compose -f $(COMPOSE_FILE_TEST) --env-file $(ENV_TEST) up --build -d --remove-orphans
up-test:
	docker compose -f $(COMPOSE_FILE_TEST) --env-file $(ENV_TEST) up -d --remove-orphans
down-test:
	docker compose -f $(COMPOSE_FILE_TEST) --env-file $(ENV_TEST) down


# --------------------------------------------------------------------------------------------------------------------
confirm:
	@echo "Remover recursos Docker não usados (containers, redes, imagens, volumes)? [y/N] " && read ans && [ $${ans:-N} = y ]
clean: confirm
	@echo "Executando limpeza..."
	docker system prune -f
	docker volume prune -f
	docker network prune -f
