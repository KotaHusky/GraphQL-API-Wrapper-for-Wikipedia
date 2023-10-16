# Variable for the Docker image name
IMAGE_NAME = api

# Build the Docker image using Nx and Docker
docker-build:
	npx nx docker-build api

# Run the Docker container
docker-run:
	docker run -p 4000:4000 -t $(IMAGE_NAME)

# Remove the Docker image
docker-clean:
	docker rmi -f $(IMAGE_NAME)

# Build and then run the Docker container
docker-all: docker-build docker-run
