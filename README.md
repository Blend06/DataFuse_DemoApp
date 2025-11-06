# 🚀 Distributed Computation Demo

A complete full-stack application demonstrating distributed computing with real-time progress tracking, built with FastAPI, Celery, Redis, and modern DevOps practices.

## 🏗️ Architecture

- **Frontend**: Component-based JavaScript (React-style) with Nginx
- **Backend**: FastAPI REST API with async endpoints
- **Worker**: Celery distributed task processor
- **Database**: Redis (message broker + temporary storage)
- **Infrastructure**: Docker Compose orchestration

## ⚡ Quick Start

### Prerequisites
```bash
# Required software
- Docker Desktop (latest version)
- Node.js 16+ (for testing)
- Git

# Verify installations
docker --version
docker-compose --version
node --version
npm --version
```

### 🚀 Run the Application

1. **Clone and navigate to project:**
   ```bash
   git clone <repository-url>
   cd DataFuse_DemoApp
   ```

2. **Start all services:**
   ```bash
   # Build and start all containers
   docker-compose up --build

   # Or run in background
   docker-compose up --build -d
   ```

3. **Access the application:**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8000
   - **API Documentation**: http://localhost:8000/docs
   - **Debug Endpoint**: http://localhost:8000/debug/jobs

## 🧪 How to Test the Application

### Manual Testing
1. **Submit a computation job:**
   ```bash
   # Open browser to http://localhost:3000
   # Enter numbers: 1,2,3,4,5,10,15,20
   # Select operation: square, factorial, or double
   # Click "Start Computation"
   ```

2. **Watch real-time progress:**
   - Progress bar updates every second
   - Status changes: pending → running → completed
   - View processing details and results

3. **Test different features:**
   - Try different operations (square, factorial, double)
   - Submit multiple jobs simultaneously
   - Click on job history to view previous results
   - Test form validation with invalid inputs

4. **API Testing:**
   ```bash
   # Test API directly
   curl http://localhost:8000/
   
   # Submit job via API
   curl -X POST http://localhost:8000/jobs \
     -H "Content-Type: application/json" \
     -d '{"numbers": [1,2,3], "operation": "square"}'
   
   # Check job status (replace JOB_ID)
   curl http://localhost:8000/jobs/JOB_ID
   
   # View all jobs (debug)
   curl http://localhost:8000/debug/jobs
   ```

## 🛠️ Development Commands

### Docker Operations
```bash
# Start all services (with build)
docker-compose up --build

# Start services in background
docker-compose up -d

# Rebuild specific service
docker-compose build backend
docker-compose build frontend

# View service logs
docker-compose logs -f backend
docker-compose logs -f worker
docker-compose logs -f frontend
docker-compose logs -f redis

# View all logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes/networks
docker-compose down -v

# Remove all containers and images
docker-compose down --rmi all -v
```

### Service Management
```bash
# Check service status
docker-compose ps

# Restart specific service
docker-compose restart backend
docker-compose restart worker

# Scale workers (run multiple)
docker-compose up --scale worker=3

# Execute commands in running containers
docker-compose exec backend bash
docker-compose exec redis redis-cli
docker-compose exec frontend sh

# View container resource usage
docker stats
```

### Local Development Setup
```bash
# Backend development (without Docker)
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Start Redis locally (required)
redis-server

# Start backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Start Celery worker
celery -A celery_app worker --loglevel=info

# Frontend development
cd frontend
# Serve with any static server, e.g.:
python -m http.server 3000
# or
npx serve -p 3000
```

## 🧪 Testing

### Automated Testing Setup
```bash
# Install test dependencies
npm install

# Install Python test dependencies
cd backend
pip install pytest pytest-asyncio httpx
cd ..
```

### Backend Unit Tests
```bash
# Run backend tests
cd backend
python -m pytest tests/ -v

# Run with coverage
python -m pytest tests/ -v --cov=.

# Run specific test file
python -m pytest tests/test_api.py -v

# Test API health manually
curl http://localhost:8000/
```

### End-to-End Tests with Cypress
```bash
# Ensure application is running first
docker-compose up -d

# Run E2E tests (headless)
npm run test:e2e

# Run E2E tests (Chrome headless)
npm run test:e2e:ci

# Open Cypress GUI for interactive testing
npm run test:e2e:open

# Run full Docker + E2E test suite
npm run docker:test
```

### Local Testing Scripts
```bash
# Windows
test-local.bat

# Linux/Mac
chmod +x test-local.sh
./test-local.sh

# Quick Cypress verification
node test-cypress-quick.js
```

### Manual Testing Checklist
- [ ] Application loads at http://localhost:3000
- [ ] Form accepts valid number inputs
- [ ] Form validates invalid inputs
- [ ] Job submission creates new job
- [ ] Real-time progress updates work
- [ ] Results display correctly
- [ ] Job history shows previous jobs
- [ ] Different operations work (square, factorial, double)
- [ ] API endpoints respond correctly
- [ ] Debug endpoint shows Redis data

**Test Coverage:**
- ✅ **Application Loading** - UI elements and page structure
- ✅ **Form Validation** - Input validation and error handling  
- ✅ **Job Submission** - API integration and job creation
- ✅ **Real-time Updates** - Status polling and progress tracking
- ✅ **Results Display** - Data formatting and presentation
- ✅ **Job History** - Navigation and data persistence
- ✅ **Operations** - Different computation types
- ✅ **End-to-End Workflows** - Complete user journeys

## CI/CD Pipeline

The project includes a comprehensive GitHub Actions pipeline that:

- **Backend Testing**: Runs Python tests with Redis service
- **Docker Build**: Builds and tests all containers
- **E2E Testing**: Runs Cypress tests against the full application
- **Code Quality**: Lints Python and JavaScript code
- **Build Summary**: Provides clear pass/fail status

### Pipeline Triggers
- Push to `main` or `develop` branches
- Pull requests to `main` branch

### Pipeline Jobs
1. **backend-tests**: Python unit tests and API health checks
2. **docker-build**: Container builds and integration tests
3. **e2e-tests**: Full application E2E testing with Cypress
4. **code-quality**: Code linting and syntax validation

## 📡 API Endpoints

### Job Management
- `POST /jobs` - Submit new computation job
  ```bash
  curl -X POST http://localhost:8000/jobs \
    -H "Content-Type: application/json" \
    -d '{"numbers": [1,2,3,4,5], "operation": "square"}'
  ```

- `GET /jobs/{job_id}` - Get job status and results
  ```bash
  curl http://localhost:8000/jobs/your-job-id-here
  ```

### Debug & Monitoring
- `GET /debug/jobs` - View all jobs in Redis (debug)
  ```bash
  curl http://localhost:8000/debug/jobs
  ```

- `GET /docs` - Interactive API documentation
  ```bash
  # Open in browser: http://localhost:8000/docs
  ```

- `GET /` - Health check endpoint
  ```bash
  curl http://localhost:8000/
  ```

## 📋 Complete Command Reference

### Initial Setup
```bash
# Clone repository
git clone <repository-url>
cd DataFuse_DemoApp

# Install dependencies
npm install

# Start application
docker-compose up --build
```

### Daily Development
```bash
# Start development environment
docker-compose up -d

# View logs while developing
docker-compose logs -f backend worker

# Run tests
npm run test:e2e

# Stop when done
docker-compose down
```

### Testing Commands
```bash
# Backend tests
cd backend && python -m pytest tests/ -v

# E2E tests (headless)
npm run test:e2e

# E2E tests (interactive)
npm run test:e2e:open

# Local test script
./test-local.sh  # Linux/Mac
test-local.bat   # Windows

# Quick verification
node test-cypress-quick.js
```

### Docker Management
```bash
# Build specific service
docker-compose build backend

# Restart service
docker-compose restart worker

# Scale workers
docker-compose up --scale worker=3

# View container stats
docker stats

# Clean up
docker-compose down -v
docker system prune -a
```

### Debugging Commands
```bash
# Check service status
docker-compose ps

# Access container shell
docker-compose exec backend bash
docker-compose exec redis redis-cli

# View Redis data
docker-compose exec redis redis-cli keys "*"

# Monitor API calls
curl -w "@curl-format.txt" http://localhost:8000/jobs

# Check network connectivity
docker-compose exec backend ping redis
```

### Production Commands
```bash
# Build for production
docker-compose -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d

# Monitor production
docker-compose -f docker-compose.prod.yml logs -f

# Backup Redis data
docker-compose exec redis redis-cli save
```

---

## 🎯 Quick Start Summary

**For Impatient Developers:**
```bash
git clone <repo> && cd DataFuse_DemoApp
docker-compose up --build
# Open http://localhost:3000
# Submit job: 1,2,3,4,5 with "square" operation
# Watch real-time progress!
```

**For Thorough Testing:**
```bash
npm install
docker-compose up -d
npm run test:e2e
curl http://localhost:8000/debug/jobs
```

**For Production Deployment:**
```bash
docker-compose -f docker-compose.prod.yml up --build -d
# Configure environment variables
# Set up monitoring and logging
```

## 🔧 Troubleshooting

### Common Issues

**Docker not starting:**
```bash
# Check Docker is running
docker info

# Restart Docker Desktop
# Windows: Restart Docker Desktop application
# Linux: sudo systemctl restart docker
```

**Port conflicts:**
```bash
# Check what's using ports
netstat -an | findstr :3000
netstat -an | findstr :8000

# Kill processes using ports (Windows)
taskkill /F /PID <process_id>

# Change ports in docker-compose.yml if needed
```

**Services not connecting:**
```bash
# Check all containers are running
docker-compose ps

# Check container logs
docker-compose logs backend
docker-compose logs worker
docker-compose logs redis

# Restart problematic service
docker-compose restart backend
```

**Tests failing:**
```bash
# Ensure application is running
docker-compose up -d

# Check service health
curl http://localhost:8000/
curl http://localhost:3000/

# Clear test cache
npm run test:e2e -- --env clearCache=true
```

### Performance Optimization
```bash
# Monitor resource usage
docker stats

# Limit container resources
docker-compose up --scale worker=2

# Clean up unused Docker resources
docker system prune -a
```

## 📁 Project Structure

```
DataFuse_DemoApp/
├── 📁 backend/                 # FastAPI backend service
│   ├── 📁 tests/              # Backend unit tests
│   │   ├── __init__.py
│   │   └── test_api.py        # API endpoint tests
│   ├── Dockerfile             # Backend container config
│   ├── requirements.txt       # Python dependencies
│   ├── main.py               # FastAPI application
│   └── celery_app.py         # Celery worker tasks
├── 📁 frontend/               # Frontend application
│   ├── 📁 components/         # JavaScript components
│   │   ├── JobSubmitter.js    # Form handling
│   │   ├── JobStatusDisplay.js # Status updates
│   │   ├── JobPoller.js       # Background polling
│   │   └── JobHistory.js      # Job history management
│   ├── Dockerfile             # Frontend container config
│   ├── index.html            # Main UI template
│   ├── style.css             # Application styling
│   └── app.js                # Main application controller
├── 📁 cypress/                # E2E testing
│   ├── 📁 e2e/
│   │   └── app.cy.js         # Cypress test specs
│   ├── 📁 support/
│   │   ├── commands.js       # Custom Cypress commands
│   │   └── e2e.js           # Test configuration
│   └── 📁 screenshots/       # Test failure screenshots
├── 📁 .github/               # CI/CD pipeline
│   └── 📁 workflows/
│       └── ci.yml            # GitHub Actions workflow
├── cypress.config.js         # Cypress configuration
├── docker-compose.yml        # Service orchestration
├── package.json              # Node.js dependencies
├── test-local.bat           # Windows test script
├── test-local.sh            # Linux/Mac test script
├── test-cypress-quick.js    # Quick test verification
└── README.md                # This file
```

## 🚀 Deployment

### Production Considerations
```bash
# Environment variables for production
export REDIS_URL=redis://production-redis:6379
export API_BASE_URL=https://api.yourdomain.com
export ENVIRONMENT=production

# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy with production config
docker-compose -f docker-compose.prod.yml up -d
```

### Scaling
```bash
# Scale workers based on load
docker-compose up --scale worker=5

# Monitor worker performance
docker-compose logs -f worker

# Load balancing (add to docker-compose.yml)
# Use nginx upstream for multiple backend instances
```

## 📊 Monitoring

### Health Checks
```bash
# Application health
curl http://localhost:8000/

# Redis health
docker-compose exec redis redis-cli ping

# Service status
docker-compose ps

# Resource usage
docker stats --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```

### Logging
```bash
# View all logs
docker-compose logs -f

# Filter logs by service
docker-compose logs -f backend | grep ERROR

# Export logs
docker-compose logs > application.log
```