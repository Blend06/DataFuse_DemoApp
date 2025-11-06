class JobPoller {
    constructor(onStatusUpdate) {
        this.onStatusUpdate = onStatusUpdate;
        this.currentJobId = null;
        this.pollingInterval = null;
        this.pollIntervalMs = 1000; // 1 second
    }

    start(jobId) {
        this.currentJobId = jobId;
        
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
        }
        
        // Start polling
        this.pollingInterval = setInterval(() => {
            this.checkStatus();
        }, this.pollIntervalMs);
        
        // Initial check
        this.checkStatus();
    }

    stop() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
        this.currentJobId = null;
    }

    async checkStatus() {
        if (!this.currentJobId) return;
        
        try {
            const response = await fetch(`http://localhost:8000/jobs/${this.currentJobId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const jobData = await response.json();
            this.onStatusUpdate(jobData);
            
            // Stop polling if job is done
            if (jobData.status === 'completed' || jobData.status === 'failed') {
                this.stop();
            }
            
        } catch (error) {
            console.error('Error checking job status:', error);
        }
    }

    isPolling() {
        return this.pollingInterval !== null;
    }

    getCurrentJobId() {
        return this.currentJobId;
    }
}