# Use Python 3.11 as base image
FROM python:3.11-slim

# Set working directory inside container
WORKDIR /app

# Copy requirements first (Docker layer caching optimization)
COPY requirements.txt .

# Install Python packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy our application code
COPY . .

# Expose port 8000 (where FastAPI will run)
EXPOSE 8000

# Default command - can be overridden in docker-compose
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]