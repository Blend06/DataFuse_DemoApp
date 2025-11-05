const API_BASE = 'http://localhost:8000';

class JobManager {
    constructor() {
        this.currentJobId = null;
        this.pollingInterval = null;
        this.jobs = new Map(); // Store job history
        
        this.initializeEventListeners();
        this.loadJobHistory();
    }

    initializeEventListeners() {
        const form = document.getElementById('jobForm');
        form.addEventListener('submit', (e) => this.handleJobSubmission(e));
    }

    async handleJobSubmission(event) {
        event.preventDefault();
        
        const numbersInput = document.getElementById('numbers').value;
        const operation = document.getElementById('operation').value;
        const submitBtn = document.getElementById('submitBtn');
        
        // Parse and validate numbers
        const numbers = numbersInput.split(',')
            .map(n => parseInt(n.trim()))
            .filter(n => !isNaN(n));
            
        if (numbers.length === 0) {
            alert('Please enter valid numbers separated by commas');
            return;
        }
        
        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        try {
            // Submit job to API
            const response = await fetch(`${API_BASE}/jobs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    numbers: numbers,
                    operation: operation
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const jobData = await response.json();
            this.currentJobId = jobData.job_id;
            
            // Show status section and start polling
            this.showJobStatus(jobData.job_id);
            this.startPolling();
            
            // Add to job history
            this.jobs.set(jobData.job_id, {
                id: jobData.job_id,
                numbers: numbers,
                operation: operation,
                status: 'pending',
                submittedAt: new Date()
            });
            
            this.updateJobsList();
            
        } catch (error) {
            console.error('Error submitting job:', error);
            alert('Failed to submit job. Make sure the API is running!');
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Start Computation';
        }
    }

    showJobStatus(jobId) {
        const statusSection = document.getElementById('statusSection');
        const jobIdElement = document.getElementById('jobId');
        
        statusSection.style.display = 'block';
        jobIdElement.textContent = jobId;
        
        // Reset displays
        document.getElementById('progressContainer').style.display = 'none';
        document.getElementById('resultsContainer').style.display = 'none';
        document.getElementById('errorContainer').style.display = 'none';
    }

    startPolling() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
        }
        
        // Poll every 1 second
        this.pollingInterval = setInterval(() => {
            this.checkJobStatus();
        }, 1000);
        
        // Initial check
        this.checkJobStatus();
    }

    async checkJobStatus() {
        if (!this.currentJobId) return;
        
        try {
            const response = await fetch(`${API_BASE}/jobs/${this.currentJobId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const jobData = await response.json();
            this.updateJobDisplay(jobData);
            
            // Update job history
            if (this.jobs.has(this.currentJobId)) {
                const job = this.jobs.get(this.currentJobId);
                job.status = jobData.status;
                job.lastUpdate = new Date();
                this.updateJobsList();
            }
            
            // Stop polling if job is done
            if (jobData.status === 'completed' || jobData.status === 'failed') {
                clearInterval(this.pollingInterval);
                this.pollingInterval = null;
            }
            
        } catch (error) {
            console.error('Error checking job status:', error);
        }
    }

    updateJobDisplay(jobData) {
        const statusElement = document.getElementById('jobStatus');
        const progressContainer = document.getElementById('progressContainer');
        const resultsContainer = document.getElementById('resultsContainer');
        const errorContainer = document.getElementById('errorContainer');
        
        statusElement.textContent = jobData.status.toUpperCase();
        statusElement.className = `status-badge status-${jobData.status}`;
        
        if (jobData.status === 'running') {
            // Show progress
            progressContainer.style.display = 'block';
            const progressFill = document.getElementById('progressFill');
            const progressText = document.getElementById('progressText');
            
            const progress = jobData.progress || 0;
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${progress}% (${jobData.completed || 0}/${jobData.total || 0})`;
            
        } else if (jobData.status === 'completed') {
            // Show results
            progressContainer.style.display = 'none';
            resultsContainer.style.display = 'block';
            
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '';
            
            if (jobData.results) {
                jobData.results.forEach(result => {
                    const resultItem = document.createElement('div');
                    resultItem.className = 'result-item';
                    resultItem.innerHTML = `
                        <span>Input: ${result.input}</span>
                        <span>Output: ${result.output}</span>
                    `;
                    resultsDiv.appendChild(resultItem);
                });
            }
            
        } else if (jobData.status === 'failed') {
            // Show error
            progressContainer.style.display = 'none';
            errorContainer.style.display = 'block';
            
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.textContent = jobData.error || 'Unknown error occurred';
        }
    }

    updateJobsList() {
        const jobsList = document.getElementById('jobsList');
        jobsList.innerHTML = '';
        
        // Show most recent jobs first
        const sortedJobs = Array.from(this.jobs.values())
            .sort((a, b) => b.submittedAt - a.submittedAt)
            .slice(0, 5); // Show last 5 jobs
        
        sortedJobs.forEach(job => {
            const jobCard = document.createElement('div');
            jobCard.className = 'job-card';
            jobCard.innerHTML = `
                <h4>Job ${job.id.substring(0, 8)}...</h4>
                <p><strong>Numbers:</strong> ${job.numbers.join(', ')}</p>
                <p><strong>Operation:</strong> ${job.operation}</p>
                <p><strong>Status:</strong> <span class="status-badge status-${job.status}">${job.status}</span></p>
                <p><strong>Submitted:</strong> ${job.submittedAt.toLocaleTimeString()}</p>
            `;
            
            // Make clickable to view details
            jobCard.style.cursor = 'pointer';
            jobCard.addEventListener('click', () => {
                this.currentJobId = job.id;
                this.showJobStatus(job.id);
                this.startPolling();
            });
            
            jobsList.appendChild(jobCard);
        });
        
        if (sortedJobs.length === 0) {
            jobsList.innerHTML = '<p style="color: #666; text-align: center;">No jobs submitted yet</p>';
        }
    }

    loadJobHistory() {
        // In a real app, you'd load this from localStorage or API
        // For now, just initialize empty
        this.updateJobsList();
    }
}

// Initialize the app when page loads
document.addEventListener('DOMContentLoaded', () => {
    new JobManager();
});