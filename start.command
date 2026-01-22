#!/bin/bash

# Workfly Dev Environment - START
cd "$(dirname "$0")"

echo "==================================="
echo "  Workfly Dev Environment"
echo "==================================="
echo ""

# Start database services in background
echo "Starting PostgreSQL and Redis..."
docker compose -f docker-compose.dev.yml up -d db redis

# Wait for database to be ready
echo "Waiting for database..."
sleep 3

# Install dependencies if needed
if [ ! -d "backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Generate Prisma client and push schema
echo "Setting up database..."
cd backend
npx prisma generate
npx prisma db push --skip-generate
cd ..

echo ""
echo "==================================="
echo "  Starting servers..."
echo "==================================="
echo ""
echo "  Backend:  http://localhost:3000"
echo "  Frontend: http://localhost:5173"
echo ""
echo "  Press Ctrl+C to stop all services"
echo "==================================="
echo ""

# Start backend and frontend in parallel
cd backend && npm run dev &
BACKEND_PID=$!

cd frontend && npm run dev &
FRONTEND_PID=$!

# Handle Ctrl+C
trap "echo ''; echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; docker compose -f docker-compose.dev.yml stop db redis; echo 'Done.'; exit 0" INT

# Wait for both processes
wait
