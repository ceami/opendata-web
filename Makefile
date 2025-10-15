# Copyright 2025 Team Aeris
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
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