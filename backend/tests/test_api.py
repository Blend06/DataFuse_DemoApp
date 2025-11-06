import pytest
from fastapi.testclient import TestClient

# Simple test that only tests the root endpoint (no Redis needed)
def test_root_endpoint_simple():
    from main import app
    client = TestClient(app)
    
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Distributed Computation API is running!"}
    print("✓ Root endpoint test passed!")

# Run the test if called directly
if __name__ == "__main__":
    import sys
    import os
    # Add parent directory to path so we can import main
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    test_root_endpoint_simple()
    print("All basic tests passed!")