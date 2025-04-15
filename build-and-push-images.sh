#!/bin/bash

# Exit on error
set -e

# Check if Docker Hub username is provided
if [ -z "$1" ]; then
  echo "Error: Docker Hub username not provided"
  echo "Usage: ./build-and-push-images.sh <docker-hub-username>"
  exit 1
fi

DOCKER_HUB_USERNAME=$1
FRONTEND_IMAGE="capstone-frontend"
BACKEND_IMAGE="capstone-backend"
TAG="latest"

echo "Building and pushing Docker images for user: $DOCKER_HUB_USERNAME"

# Build frontend image
echo "Building frontend image..."
docker build -t $FRONTEND_IMAGE:$TAG -f app/frontend/Dockerfile .

# Tag frontend image
echo "Tagging frontend image..."
docker tag $FRONTEND_IMAGE:$TAG $DOCKER_HUB_USERNAME/$FRONTEND_IMAGE:$TAG

# Push frontend image
echo "Pushing frontend image to Docker Hub..."
docker push $DOCKER_HUB_USERNAME/$FRONTEND_IMAGE:$TAG

# Build backend image
echo "Building backend image..."
docker build -t $BACKEND_IMAGE:$TAG -f app/backend/Dockerfile .

# Tag backend image
echo "Tagging backend image..."
docker tag $BACKEND_IMAGE:$TAG $DOCKER_HUB_USERNAME/$BACKEND_IMAGE:$TAG

# Push backend image
echo "Pushing backend image to Docker Hub..."
docker push $DOCKER_HUB_USERNAME/$BACKEND_IMAGE:$TAG

echo "All images have been built and pushed successfully!"
echo "Update your terraform.tfvars file with these image names:"
echo "frontend_image = \"$DOCKER_HUB_USERNAME/$FRONTEND_IMAGE:$TAG\""
echo "backend_image  = \"$DOCKER_HUB_USERNAME/$BACKEND_IMAGE:$TAG\"" 