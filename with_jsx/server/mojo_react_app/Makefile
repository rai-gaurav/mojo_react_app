DOCKER_TAG ?= mojo_react_app:development
NO_CACHE ?= false
PULL ?= false
BUILD_TYPE ?= development
CONTAINER_NAME ?= mojo_react_app
HTTPS_OUT_PORT ?= 443
HTTPS_IN_PORT ?= 443
HTTP_OUT_PORT ?= 80
HTTP_IN_PORT ?= 80
DOCKER_REPO ?= <docker_repo_url>
ADDRESS ?= 0.0.0.0
DOCKER_CFG = <path to docker config on machine>

build:
	# Build the dockerfile
	docker build --pull=${PULL} --no-cache=$(NO_CACHE) -t $(DOCKER_TAG) .

create:
	# Create the container and copy the certificates
	echo 'Creating container for ${ADDRESS}'
	docker create --name ${CONTAINER_NAME}_${BUILD_TYPE} -t \
		-p ${ADDRESS}:$(HTTPS_OUT_PORT):$(HTTPS_IN_PORT) -p ${ADDRESS}:$(HTTP_OUT_PORT):$(HTTP_IN_PORT) --env mode=${BUILD_TYPE} \
		${DOCKER_TAG}
	docker cp ${DOCKER_CFG}/mojo_react_app/apache-certificate/apache_certificate_${BUILD_TYPE}.crt ${CONTAINER_NAME}_${BUILD_TYPE}:/etc/ssl/certs/server.crt
	docker cp ${DOCKER_CFG}/mojo_react_app/apache-certificate/apache_certificate_${BUILD_TYPE}.key ${CONTAINER_NAME}_${BUILD_TYPE}:/etc/ssl/private/server.key

start:
	# Start a container
	docker start ${CONTAINER_NAME}_${BUILD_TYPE}

run:
	# Create and start the container
	make create -e ADDRESS=${ADDRESS} HTTPS_OUT_PORT=${HTTPS_OUT_PORT} HTTPS_IN_PORT=${HTTPS_IN_PORT} BUILD_TYPE=${BUILD_TYPE} DOCKER_TAG=${DOCKER_TAG}
	make start -e BUILD_TYPE=${BUILD_TYPE}
	make show

stop:
	# Stop a running container
	docker stop ${CONTAINER_NAME}_${BUILD_TYPE};

clean_container:
	# remove previous container
	docker rm -f ${CONTAINER_NAME}_${BUILD_TYPE} 2>/dev/null \
	&& echo 'Container for "${CONTAINER_NAME}_${BUILD_TYPE}" removed.' \
	|| echo 'Container for "${CONTAINER_NAME}_${BUILD_TYPE}" already removed or not found.'

clean_image:
	# remove created image
	docker rmi ${DOCKER_TAG} 2>/dev/null \
	&& echo 'Image(s) for "${DOCKER_TAG}" removed.' \
	|| echo 'Image(s) for "${DOCKER_TAG}" already removed or not found.'

dev: 
	make build -e PULL=${PULL} NO_CACHE=${NO_CACHE}
	make clean_container
	make create
	make start
	make show

stag:
	$(eval override BUILD_TYPE=staging)
	$(eval override DOCKER_TAG=${CONTAINER_NAME}:${BUILD_TYPE})
	# This will return only the IP address associated with the domain name ans assign it to ADDRESS
	$(eval override ADDRESS=$(shell dig +short <your staging URL e.g. mojo-react-app-staging.com>))

	make build -e PULL=true NO_CACHE=true DOCKER_TAG=${DOCKER_TAG}
	make clean_container -e BUILD_TYPE=${BUILD_TYPE}
	make create -e ADDRESS=${ADDRESS} BUILD_TYPE=${BUILD_TYPE} DOCKER_TAG=${DOCKER_TAG}
	make start -e BUILD_TYPE=${BUILD_TYPE}
	make show

prod:
	$(eval override BUILD_TYPE=production)
	$(eval override DOCKER_TAG = ${CONTAINER_NAME}:${BUILD_TYPE})
	# This will return only the IP address associated with the domain name ans assign it to ADDRESS
	$(eval override ADDRESS=$(shell dig +short <your production URL e.g. mojo-react-app.com))

	make build -e PULL=true NO_CACHE=true DOCKER_TAG=${DOCKER_TAG}
	make clean_container -e BUILD_TYPE=${BUILD_TYPE}
	make create -e ADDRESS=${ADDRESS} BUILD_TYPE=${BUILD_TYPE} DOCKER_TAG=${DOCKER_TAG}
	make start -e BUILD_TYPE=${BUILD_TYPE}
	make show

show:
	# show running containers
	docker ps | grep ${CONTAINER_NAME}

rebuild:
	# rebuilt the dockerfile
	make clean_container -e BUILD_TYPE=${BUILD_TYPE}
	make build -e PULL=true NO_CACHE=true DOCKER_TAG=${DOCKER_TAG}

up:
	# Run container on port
	make build -e PULL=true NO_CACHE=true DOCKER_TAG=${DOCKER_TAG}
	make run -e HTTPS_OUT_PORT=${HTTPS_OUT_PORT} HTTPS_IN_PORT=${HTTPS_IN_PORT} BUILD_TYPE=${BUILD_TYPE} DOCKER_TAG=${DOCKER_TAG}

login:
	# run as a service and attach to it
	docker exec -it ${CONTAINER_NAME}_${BUILD_TYPE} bash

release:
	make build -e PULL=true NO_CACHE=true DOCKER_TAG=${DOCKER_TAG}
	make push -e VERSION=${VERSION}

push:
	docker push $(DOCKER_REPO)/$(CONTAINER_NAME):$(VERSION)

pull:
	docker pull $(DOCKER_REPO)/$(CONTAINER_NAME):$(VERSION)

# Docker tagging
tag:
	## Generate container tags for the `{version}`
	@echo 'create tag $(VERSION)'
	docker tag $(DOCKER_TAG) $(DOCKER_REPO)/$(CONTAINER_NAME):$(VERSION)

help:
	@echo ''
	@echo 'Usage: make [TARGET] [EXTRA_ARGUMENTS]'
	@echo 'Targets:'
	@echo '  build    	build docker --image--'
	@echo '  rebuild  	rebuild docker --image--'
	@echo '  dev     	run docker --container-- in development mode => $(DOCKER_TAG)'
	@echo '  stag     	run docker --container-- in staging mode'
	@echo '  prod     	run docker --container-- in production mode'
	@echo '  login   	run as service and login --container--'
	@echo '  clean_image    	remove docker --image-- '
	@echo ''
	@echo 'Extra arguments:'
	@echo 'CONTAINER_NAME=: 	make clean_container -e CONTAINER_NAME=my_app (no need to provide this param, it will be set by default)'
	@echo 'BUILD_TYPE=:		make clean_container -e CONTAINER_NAME=my_app BUILD_TYPE=staging (whether the build type is 'development', 'staging' or 'production')'
	@echo 'DOCKER_TAG=:		make build -e DOCKER_TAG=my_app:staging'
	@echo 'HTTPS_OUT_PORT=:		make create -e HTTPS_IN_PORT=8080 (port from which the request will come- outside world)'
	@echo 'HTTPS_IN_PORT=:		make create -e HTTPS_IN_PORT=443 (port to which the request will be forwarded)'
