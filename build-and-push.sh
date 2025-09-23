#!/bin/bash
set -e

# Configuration
REGISTRY="registry.thw-tools.de"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Parse command line arguments
ONLY_PUSH=false
USE_CACHE=false
MODE=""

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --only-push)
      ONLY_PUSH=true
      shift
      ;;
    --cache)
      USE_CACHE=true
      shift
      ;;
    prod|dev)
      if [[ -n "$MODE" ]]; then
        echo -e "${RED}❌ Error: Multiple modes specified. Use only one mode.${NC}"
        exit 1
      fi
      MODE=$1
      shift
      ;;
    *)
      echo -e "${RED}❌ Error: Unknown option '$1'${NC}"
      echo "Usage: $0 [--only-push] [--cache] <prod|dev>"
      exit 1
      ;;
  esac
done

# Check if mode is specified
if [[ -z "$MODE" ]]; then
  echo -e "${RED}❌ Error: Mode not specified. Use 'prod' or 'dev'.${NC}"
  echo "Usage: $0 [--only-push] [--cache] <prod|dev>"
  exit 1
fi

if [[ "$ONLY_PUSH" == "true" ]]; then
  echo -e "${BLUE}🚀 Starting push process in '${MODE}' mode (skipping build)...${NC}"
else
  echo -e "${BLUE}🚀 Starting build and push process in '${MODE}' mode...${NC}"
fi

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

# Build all services using docker compose (skip if --only-push is used)
if [[ "$ONLY_PUSH" != "true" ]]; then
  if [[ "$USE_CACHE" == "true" ]]; then
    echo -e "${BLUE}🏗️ Building Docker images for AMD64 architecture (with cache)...${NC}"
    docker compose --env-file "${ENV_FILE}" build
  else
    echo -e "${BLUE}🏗️ Building Docker images for AMD64 architecture (no cache)...${NC}"
    docker compose --env-file "${ENV_FILE}" build --no-cache
  fi
else
  echo -e "${BLUE}⏭️ Skipping build step (--only-push mode)${NC}"
fi

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