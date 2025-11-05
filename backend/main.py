from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from celery_app import compute_task
import uuid
import redis
import json

app = FastAPI(title="Distributed Computation Demo")

# Allow frontend to call our API (CORS = Cross-Origin Resource Sharing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to Redis to store job results
redis_client = redis.Redis(host='redis', port=6379, decode_responses=True)

class JobRequest(BaseModel):
    numbers: list[int]  # List of numbers to process
    operation: str = "square"  # What operation to perform

class JobResponse(BaseModel):
    job_id: str
    status: str

@app.post("/jobs", response_model=JobResponse)
async def create_job(job_request: JobRequest):
    """Submit a new computation job"""
    job_id = str(uuid.uuid4())  # Generate unique ID
    
    # Start the Celery task
    task = compute_task.delay(job_id, job_request.numbers, job_request.operation)
    
    # Store initial status in Redis
    redis_client.setex(
        f"job:{job_id}", 
        3600,  # Expire after 1 hour
        json.dumps({"status": "pending", "task_id": task.id})
    )
    
    return JobResponse(job_id=job_id, status="pending")

@app.get("/jobs/{job_id}")
async def get_job_status(job_id: str):
    """Check job status and get results"""
    job_data = redis_client.get(f"job:{job_id}")
    
    if not job_data:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return json.loads(job_data)

@app.get("/debug/jobs")
async def list_all_jobs():
    """Debug endpoint to see all jobs in Redis"""
    keys = redis_client.keys("job:*")
    jobs = {}
    for key in keys:
        job_data = redis_client.get(key)
        if job_data:
            jobs[key] = json.loads(job_data)
    return {"total_jobs": len(jobs), "jobs": jobs}

@app.get("/")
async def root():
    return {"message": "Distributed Computation API is running!"}