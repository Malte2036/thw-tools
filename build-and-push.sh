#!/bin/bash
set -e

# Configuration
REGISTRY="registry.thw-tools.de"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Build all services using docker compose
echo -e "${BLUE}🏗️  Building Docker images...${NC}"
docker compose build --no-cache

# Tag and push images to registry
echo -e "${BLUE}📦 Tagging and pushing images to registry...${NC}"

# Backend
echo -e "${BLUE}📦 Processing backend...${NC}"
docker tag thw-tools-backend:latest ${REGISTRY}/thw-tools-backend:latest
docker push ${REGISTRY}/thw-tools-backend:latest

# THW-Tools frontend
echo -e "${BLUE}📦 Processing thw-tools frontend...${NC}"
docker tag thw-tools:latest ${REGISTRY}/thw-tools:latest
docker push ${REGISTRY}/thw-tools:latest

# Inventar frontend
echo -e "${BLUE}📦 Processing inventar frontend...${NC}"
docker tag thw-inventar:latest ${REGISTRY}/thw-inventar:latest
docker push ${REGISTRY}/thw-inventar:latest

echo -e "${GREEN}✅ Build and push complete!${NC}" 