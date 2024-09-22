DB_NAME=mydatabase
DB_REPLICA_SET_NAME=rs0
DB_ROOT_USER=admin
DB_ROOT_PASSWORD=adminpwd
DB_USER=user
DB_PASSWORD=user123
DB_PORT=27017
CONTAINER_NAME=cmmongodb
ENV_FILE=.env
MONGO_STRING=mongodb://$(DB_USER):$(DB_PASSWORD)@localhost:$(DB_PORT)/$(DB_NAME)?replicaSet=$(DB_REPLICA_SET_NAME)

check-docker:
	@echo "Checking if Docker is installed..."
	@if command -v docker >/dev/null 2>&1; then \
		echo "Docker is installed."; \
	else \
		echo "Docker is not installed. Please install Docker to continue."; \
		exit 1; \
	fi

start:
	docker-compose up -d
	sleep 5

init-replica:
	@echo "Initializing replica set..."
	docker-compose exec $(CONTAINER_NAME) mongosh --username ${DB_ROOT_USER} --password ${DB_ROOT_PASSWORD} --authenticationDatabase admin --eval "rs.initiate({_id: '$(DB_REPLICA_SET_NAME)', members: [{ _id: 0, host: 'localhost:27017'}]})"

add-user:
	@echo "Adding user..."
	docker-compose exec $(CONTAINER_NAME) mongosh --username ${DB_ROOT_USER} --password ${DB_ROOT_PASSWORD} --authenticationDatabase admin --eval "db.getSiblingDB('$(DB_NAME)').createUser({user: '$(DB_USER)', pwd: '$(DB_PASSWORD)', roles: [{role: 'readWrite', db: '$(DB_NAME)'}]})"

update-env:
	@echo "Updating .env file..."
	@if [ -f $(ENV_FILE) ]; then \
		if grep -q '^MONGO_DB_CONNECTION_STRING=' $(ENV_FILE); then \
			sed -i "s|^MONGO_DB_CONNECTION_STRING=.*|MONGO_DB_CONNECTION_STRING=$(MONGO_STRING)|" $(ENV_FILE); \
		else \
			echo "MONGO_DB_CONNECTION_STRING=$(MONGO_STRING)" >> $(ENV_FILE); \
		fi \
	else \
		echo "MONGO_DB_CONNECTION_STRING=$(MONGO_STRING)" >> $(ENV_FILE); \
	fi

copy-env-template:
	@if [ ! -f $(ENV_FILE) ]; then \
		cp .env.template $(ENV_FILE); \
		echo "Copied .env.template to .env"; \
	else \
		echo ".env already exists"; \
	fi

remove:
	@echo "Stopping and removing MongoDB container..."
	docker-compose down
	@echo "Pruning volumes..."
	docker volume prune -f || true
	@echo "Clean up completed."

setup: copy-env-template update-env start init-replica add-user
	@echo "MongoDB started and configuration saved to $(ENV_FILE)"