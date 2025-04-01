#!/bin/bash
set -e

# Configuration
REGISTRY="registry.thw-tools.de"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Read build mode from the first argument (prod or dev)
MODE=$1
if [[ "$MODE" != "prod" && "$MODE" != "dev" ]]; then
  echo -e "${RED}❌ Error: Invalid mode specified. Use 'prod' or 'dev'.${NC}"
  echo "Usage: $0 <prod|dev>"
  exit 1
fi

echo -e "${BLUE}🚀 Starting build and push process in '${MODE}' mode...${NC}"

# Set environment file and tag based on mode
if [[ "$MODE" == "prod" ]]; then
  ENV_FILE=".env.production"
  TAG="prod"
else
  ENV_FILE=".env.development"
  TAG="dev"
fi

# Check if the environment file exists
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}❌ Error: Environment file '${ENV_FILE}' not found.${NC}"
    exit 1
fi

echo -e "${BLUE}🔧 Using environment file: ${ENV_FILE}${NC}"
echo -e "${BLUE}🏷️ Using tag: ${TAG}${NC}"

# Set platform for Docker builds
export DOCKER_DEFAULT_PLATFORM=linux/amd64

# Function to tag and push an image
tag_and_push() {
  local source_image=$1
  local target_image=$2
  local image_name=$3
  
  echo -e "${BLUE}📦 Processing ${image_name}...${NC}"
  
  if docker tag "${source_image}" "${target_image}"; then
    if docker push "${target_image}"; then
      echo -e "${GREEN}✓ Successfully pushed ${image_name}${NC}"
      return 0
    else
      echo -e "${RED}❌ Failed to push ${image_name}${NC}"
      return 1
    fi
  else
    echo -e "${RED}❌ Failed to tag ${image_name}${NC}"
    return 1
  fi
}

# Trap to capture ctrl+c and exit gracefully
trap 'echo -e "${RED}🛑 Build and push aborted${NC}"; exit 1' INT

# Build all services using docker compose
echo -e "${BLUE}🏗️ Building Docker images for AMD64 architecture...${NC}"
docker compose --env-file "${ENV_FILE}" build --no-cache

# Tag and push images to registry in parallel
echo -e "${BLUE}📦 Tagging and pushing images with tag '${TAG}' to registry in parallel...${NC}"

# Array to store background processes
pids=()

# Backend
tag_and_push "thw-tools-backend:latest" "${REGISTRY}/thw-tools-backend:${TAG}" "backend (${TAG})" &
pids+=($!)

# THW-Tools frontend
tag_and_push "thw-tools:latest" "${REGISTRY}/thw-tools:${TAG}" "thw-tools frontend (${TAG})" &
pids+=($!)

# Inventar frontend
tag_and_push "thw-inventar:latest" "${REGISTRY}/thw-inventar:${TAG}" "inventar frontend (${TAG})" &
pids+=($!)

# Wait for all processes to complete
failures=0
for pid in "${pids[@]}"; do
  if ! wait $pid; then
    failures=$((failures+1))
  fi
done

# Check if any failures occurred
if [ $failures -eq 0 ]; then
  echo -e "${GREEN}✨ Build and push for tag '${TAG}' complete successfully!${NC}"
  exit 0
else
  echo -e "${RED}❌ Build and push for tag '${TAG}' completed with ${failures} failure(s)${NC}"
  exit 1
fi 