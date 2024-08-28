Y='\033[0;33m'
G='\033[0;32m'
B='\033[0;34m'
W='\033[0;37m'
R='\033[0;31m'
E='\033[0m'

ENV_PROD=.envs/.env.prod
ENV_DEV=.envs/.env.dev
ENV_TEST=.envs/.env.test
COMPOSE_FILE_PROD=compose.prod.yml
COMPOSE_FILE_DEV=compose.dev.yml
COMPOSE_FILE_TEST=compose.test.yml

define load-env
	$(eval include $(1))
	$(eval export $(shell sed 's/=.*//' $(1)))
endef

define wait_for_service
	@echo ""${Y}"󰞌"${E} "Waiting service is up at "${Y}"$(1)"${E}"..."
	@echo "For more details, run: docker logs -f <container_id>"
	@echo
	@while ! curl --output /dev/null --silent --head --fail $(1); do \
		printf "\r󱍸 Checking.  ";  sleep 1; \
		printf "\r󱍸 Checking.. ";  sleep 1; \
		printf "\r󱍸 Checking...";  sleep 1; \
	done; \
	printf "\n"
endef

define ckeck_api
	@if curl --output /dev/null --silent --head --fail $(1); then \
		echo ""${G}"󰘽"${E}" Backend is up at "${G}"$(1)"${E}""; \
	else \
		echo ""${R}""${E}" Backend is down at "${R}"$(1)"${E}""; \
	fi
endef

build:
	docker compose -f $(COMPOSE_FILE_DEV) --env-file $(ENV_DEV) build
	@echo ""${B}""${E}" Build completed for "${Y}"develop"${E}" environment."

build-nc:
	docker compose -f $(COMPOSE_FILE_DEV) --env-file $(ENV_DEV) build --no-cache --force-rm
	@echo ""${B}""${E} "Build no-cache completed for "${Y}"develop"${E}" environment."

build-up:
	$(call load-env,$(ENV_DEV))
	docker compose -f $(COMPOSE_FILE_DEV) --env-file $(ENV_DEV) up --build -d --remove-orphans
	@echo ""${B}""${E}" Build completed for "${Y}"develop"${E}" environment."
	$(call wait_for_service,$(NEXTAUTH_URL))
	@echo ""${G}"󰘽"${E}" Server ready "${G}"$(NEXTAUTH_URL)"${E}""
	$(call ckeck_api,$(NEXT_PUBLIC_API_URL))

up:
	$(call load-env,$(ENV_DEV))
	docker compose -f $(COMPOSE_FILE_DEV) --env-file $(ENV_DEV) up -d --remove-orphans
	$(call wait_for_service,$(NEXTAUTH_URL))
	@echo ""${G}"󰘽"${E}" Server ready "${G}"$(NEXTAUTH_URL)"${E}""
	$(call ckeck_api,$(NEXT_PUBLIC_API_URL))

down:
	docker compose -f $(COMPOSE_FILE_DEV) --env-file $(ENV_DEV) down

build-prod:
	docker compose -f $(COMPOSE_FILE_PROD) --env-file $(ENV_PROD) build
	@echo ""${B}""${E} "Build completed for "${Y}"production"${E} "environment."

build-nc-prod:
	docker compose -f $(COMPOSE_FILE_PROD) --env-file $(ENV_PROD) build --no-cache --force-rm
	@echo ""${B}""${E} "Build no-cache completed for "${Y}"production"${E} "environment."

build-up-prod:
	$(call load-env,$(ENV_PROD))
	docker compose -f $(COMPOSE_FILE_PROD) --env-file $(ENV_PROD) up --build -d --remove-orphans
	@echo ""${B}""${E} "Build completed for "${Y}"production"${E}" environment."
	$(call wait_for_service,$(NEXTAUTH_URL))
	@echo ""${G}"󰘽"${E}" Server ready "${G}"$(NEXTAUTH_URL)"${E}""
	$(call ckeck_api,$(NEXT_PUBLIC_API_URL))

up-prod:
	$(call load-env,$(ENV_PROD))
	docker compose -f $(COMPOSE_FILE_PROD) --env-file $(ENV_PROD) up -d --remove-orphans
	$(call wait_for_service,$(NEXTAUTH_URL))
	@echo ""${G}"󰘽"${E}" Server ready "${G}"$(NEXTAUTH_URL)"${E}""
	$(call ckeck_api,$(NEXT_PUBLIC_API_URL))
down-prod:
	docker compose -f $(COMPOSE_FILE_PROD) --env-file $(ENV_PROD) down

build-test:
	docker compose -f $(COMPOSE_FILE_TEST) --env-file $(ENV_TEST) build
	@echo ""${B}""${E} "Build completed for "${Y}"test"${E}" environment."

build-nc-test:
	docker compose -f $(COMPOSE_FILE_TEST) --env-file $(ENV_TEST) build --no-cache --force-rm
	@echo ""${B}""${E}" Build no-cache completed for "${Y}"test"${E}" environment."

build-up-test:
	$(call load-env,$(ENV_TEST))
	docker compose -f $(COMPOSE_FILE_TEST) --env-file $(ENV_TEST) up --build -d --remove-orphans
	@echo ""${B}""${E}" Build completed for "${Y}"test"${E}" environment."
	$(call wait_for_service,$(NEXTAUTH_URL))
	@echo ""${G}"󰘽"${E}" Server ready "${G}"$(NEXTAUTH_URL)"${E}""
	$(call ckeck_api,$(NEXT_PUBLIC_API_URL))

up-test:
	$(call load-env,$(ENV_TEST))
	docker compose -f $(COMPOSE_FILE_TEST) --env-file $(ENV_TEST) up -d --remove-orphans
	$(call wait_for_service,$(NEXTAUTH_URL))
	@echo ""${G}"󰘽"${E}" Server ready "${G}"$(NEXTAUTH_URL)"${E}""
	$(call ckeck_api,$(NEXT_PUBLIC_API_URL))

down-test:
	docker compose -f $(COMPOSE_FILE_TEST) --env-file $(ENV_TEST) down


# --------------------------------------------------------------------------------------------------------------------

confirm:
	@echo -n ""${Y}""${E}" Remover recursos Docker não usados (containers, redes, imagens, volumes)? \n[y/N]: \b" && \
	read ans && [ $${ans:-N} = y ]

clean: confirm
	@echo ""${B}"󱍸 Executando limpeza..."${E}""
	@docker system prune -f
	@docker volume prune -f
	@docker network prune -f
	@echo ""${G}"󰘽 Limpeza concluída com sucesso."${E}""
