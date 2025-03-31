#!/bin/bash
set -e

# Configuration
REGISTRY="registry.thw-tools.de"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

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
docker compose build --no-cache

# Tag and push images to registry in parallel
echo -e "${BLUE}📦 Tagging and pushing images to registry in parallel...${NC}"

# Array to store background processes
pids=()

# Backend
tag_and_push "thw-tools-backend:latest" "${REGISTRY}/thw-tools-backend:latest" "backend" &
pids+=($!)

# THW-Tools frontend
tag_and_push "thw-tools:latest" "${REGISTRY}/thw-tools:latest" "thw-tools frontend" &
pids+=($!)

# Inventar frontend
tag_and_push "thw-inventar:latest" "${REGISTRY}/thw-inventar:latest" "inventar frontend" &
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
  echo -e "${GREEN}:sparkles: Build and push complete successfully!${NC}"
  exit 0
else
  echo -e "${RED}❌ Build and push completed with ${failures} failure(s)${NC}"
  exit 1
fi 