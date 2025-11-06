import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root_endpoint():
    """Test the root endpoint returns correct message"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Distributed Computation API is running!"}

def test_create_job():
    """Test job creation endpoint"""
    job_data = {
        "numbers": [1, 2, 3],
        "operation": "square"
    }
    response = client.post("/jobs", json=job_data)
    assert response.status_code == 200
    
    data = response.json()
    assert "job_id" in data
    assert data["status"] == "pending"

def test_create_job_validation():
    """Test job creation with invalid data"""
    # Test empty numbers
    job_data = {
        "numbers": [],
        "operation": "square"
    }
    response = client.post("/jobs", json=job_data)
    # Should still create job, validation happens in frontend
    assert response.status_code == 200

def test_get_nonexistent_job():
    """Test getting a job that doesn't exist"""
    response = client.get("/jobs/nonexistent-id")
    assert response.status_code == 404
    assert "Job not found" in response.json()["detail"]

def test_debug_jobs_endpoint():
    """Test the debug endpoint"""
    response = client.get("/debug/jobs")
    assert response.status_code == 200
    
    data = response.json()
    assert "total_jobs" in data
    assert "jobs" in data
    assert isinstance(data["total_jobs"], int)
    assert isinstance(data["jobs"], dict)