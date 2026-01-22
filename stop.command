#!/bin/bash

# Workfly Dev Environment - STOP
cd "$(dirname "$0")"

echo "==================================="
echo "  Stopping Workfly Dev Environment"
echo "==================================="
echo ""

# Stop any running node processes for this project
echo "Stopping Node.js processes..."
pkill -f "workfly/backend" 2>/dev/null
pkill -f "workfly/frontend" 2>/dev/null

# Stop Docker containers
echo "Stopping Docker containers..."
docker compose -f docker-compose.dev.yml down

echo ""
echo "All services stopped."
