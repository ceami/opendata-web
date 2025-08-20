environment := $(if $(ENV),$(ENV),local)

include .env.$(environment)
export $(shell sed 's/=.*//' .env.$(environment))

COMPOSE_FILE := Docker-compose.yml
ENV_FILE := .env.$(environment)

ifeq ($(environment),prod)
    COMPOSE_FILES := -f $(COMPOSE_FILE)
	DOCKER := /bin/docker
else ifeq ($(environment),dev)
    COMPOSE_FILES := -f $(COMPOSE_FILE)
	DOCKER := /bin/docker
else
    COMPOSE_FILES := -f $(COMPOSE_FILE)
	DOCKER := $(shell which docker)
endif

DC := $(DOCKER) compose -p $(COMPOSE_PROJECT_NAME) --env-file $(ENV_FILE) $(COMPOSE_FILES)

restart:
	@$(DC) down
	@$(DC) up -d --build
down:
	@$(DC) down
up:
	@$(DC) up -d --build