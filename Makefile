ENV_PROD=.envs/.env.prod
ENV_DEV=.envs/.env.dev
ENV_TEST=.envs/.env.test
COMPOSE_FILE_PROD=compose.prod.yml
COMPOSE_FILE_DEV=compose.dev.yml
COMPOSE_FILE_TEST=compose.test.yml

build-dev:
	docker compose -f $(COMPOSE_FILE_DEV) --env-file $(ENV_DEV) up --build -d --remove-orphans
build-prod:
	docker compose -f $(COMPOSE_FILE_PROD) --env-file $(ENV_PROD) up --build -d --remove-orphans
up-dev:
	docker compose -f $(COMPOSE_FILE_DEV) --env-file $(ENV_DEV) up -d
up-prod:
	docker compose -f $(COMPOSE_FILE_PROD) --env-file $(ENV_PROD) up -d
down-dev:
	docker compose -f $(COMPOSE_FILE_DEV) --env-file $(ENV_DEV) down
down-prod:
	docker compose -f $(COMPOSE_FILE_PROD) --env-file $(ENV_PROD) down

confirm:
	@echo "Remover recursos Docker não usados (containers, redes, imagens, volumes)? [y/N] " && read ans && [ $${ans:-N} = y ]
clean: confirm
	@echo "Executando limpeza..."
	docker system prune -f
	docker volume prune -f
	docker network prune -f


# ====================================================================================================================
# Temp: testes com backend remoto

build-test:
	docker compose -f $(COMPOSE_FILE_TEST) --env-file $(ENV_TEST) up --build -d --remove-orphans
up-test:
	docker compose -f $(COMPOSE_FILE_TEST) --env-file $(ENV_TEST) up -d
down-test:
	docker compose -f $(COMPOSE_FILE_TEST) --env-file $(ENV_TEST) down
