from celery import Celery
import redis
import json
import time
import math

# Create Celery app - this handles background tasks
celery_app = Celery(
    'computation_worker',
    broker='redis://redis:6379/0',  # Where to send tasks
    backend='redis://redis:6379/0'  # Where to store results
)

# Connect to Redis for storing job progress
redis_client = redis.Redis(host='redis', port=6379, decode_responses=True)

def simulate_heavy_computation(number: int, operation: str) -> int:
    """Simulate a CPU-intensive task"""
    time.sleep(0.5)  
    
    if operation == "square":
        return number ** 2
    elif operation == "factorial":
        return math.factorial(min(number, 10))  
    else:
        return number * 2

@celery_app.task
def compute_task(job_id: str, numbers: list[int], operation: str):
    """Main task that processes a list of numbers"""
    try:
        # Update status to running
        redis_client.setex(
            f"job:{job_id}",
            3600,
            json.dumps({
                "status": "running", 
                "progress": 0,
                "total": len(numbers)
            })
        )
        
        results = []
        
        # Process each number (this is where we could add parallel processing)
        for i, number in enumerate(numbers):
            result = simulate_heavy_computation(number, operation)
            results.append({"input": number, "output": result})
            
            # Update progress
            progress = ((i + 1) / len(numbers)) * 100
            redis_client.setex(
                f"job:{job_id}",
                3600,
                json.dumps({
                    "status": "running",
                    "progress": round(progress, 1),
                    "total": len(numbers),
                    "completed": i + 1
                })
            )
        
        # Mark as completed
        redis_client.setex(
            f"job:{job_id}",
            3600,
            json.dumps({
                "status": "completed",
                "progress": 100,
                "results": results,
                "total": len(numbers),
                "completed": len(numbers)
            })
        )
        
        return results
        
    except Exception as e:
        # Mark as failed
        redis_client.setex(
            f"job:{job_id}",
            3600,
            json.dumps({
                "status": "failed",
                "error": str(e)
            })
        )
        raise