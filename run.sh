#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

PYTHON_VERSION="3.10.20"
export BACKEND_HOST_PORT="${BACKEND_HOST_PORT:-5050}"

echo "FinPilot AI startup"
echo "Using Python ${PYTHON_VERSION} for the AI service Docker image"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required to run the full stack. Please install/start Docker and run this script again."
  exit 1
fi

if docker compose version >/dev/null 2>&1; then
  COMPOSE=(docker compose)
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE=(docker-compose)
else
  echo "Docker Compose is required. Please install Docker Compose and run this script again."
  exit 1
fi

if [ ! -f .env ]; then
  echo "Creating .env from .env.example"
  cp .env.example .env
fi

echo "Building application images"
"${COMPOSE[@]}" build ai-services backend frontend

echo "Starting databases and cache"
"${COMPOSE[@]}" up -d postgres mongo redis

echo "Starting AI services"
"${COMPOSE[@]}" up -d ai-services

echo "Starting backend API"
"${COMPOSE[@]}" up -d backend

echo "Starting frontend"
"${COMPOSE[@]}" up -d frontend

echo
"${COMPOSE[@]}" ps
echo
echo "Startup complete."
echo "Frontend:    http://localhost:3000"
echo "Backend API: http://localhost:${BACKEND_HOST_PORT}/api"
echo "AI Docs:     http://localhost:8000/docs"
