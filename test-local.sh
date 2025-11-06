#!/bin/bash

echo "Starting Local Test Suite"
echo "=============================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN} $2${NC}"
    else
        echo -e "${RED} $2${NC}"
        exit 1
    fi
}

print_info() {
    echo -e "${YELLOW}ℹ  $1${NC}"
}

# Check if Docker is running
print_info "Checking Docker..."
docker info > /dev/null 2>&1
print_status $? "Docker is running"

# Start services
print_info "Starting Docker services..."
docker-compose up -d
print_status $? "Services started"

# Wait for services to be ready
print_info "Waiting for services to be ready..."
timeout 60 bash -c 'until curl -f http://localhost:8000/ > /dev/null 2>&1; do sleep 2; done'
print_status $? "Backend API is ready"

timeout 60 bash -c 'until curl -f http://localhost:3000/ > /dev/null 2>&1; do sleep 2; done'
print_status $? "Frontend is ready"

# Test API health
print_info "Testing API health..."
curl -f http://localhost:8000/ | grep -q "Distributed Computation API is running"
print_status $? "API health check passed"

# Test job submission
print_info "Testing job submission..."
response=$(curl -s -X POST http://localhost:8000/jobs \
  -H "Content-Type: application/json" \
  -d '{"numbers": [1,2,3], "operation": "square"}')
echo $response | grep -q "job_id"
print_status $? "Job submission test passed"

# Run E2E tests if Cypress is available
if command -v npx &> /dev/null && [ -f "package.json" ]; then
    print_info "Running Cypress E2E tests..."
    npm run test:e2e:ci
    print_status $? "E2E tests passed"
else
    print_info "Cypress not found, skipping E2E tests (run 'npm install' to enable)"
fi

# Cleanup
print_info "Cleaning up..."
docker-compose down
print_status $? "Services stopped"

echo ""
echo -e "${GREEN} All tests passed! Your application is working correctly.${NC}"
echo "=============================="