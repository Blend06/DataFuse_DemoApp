class JobHistory {
    constructor(onJobSelected) {
        this.onJobSelected = onJobSelected;
        this.jobs = new Map();
        this.maxHistorySize = 10;
    }

    addJob(jobId, jobDetails) {
        this.jobs.set(jobId, {
            id: jobId,
            ...jobDetails,
            status: 'pending',
            submittedAt: new Date()
        });
        
        // Keep only recent jobs
        if (this.jobs.size > this.maxHistorySize) {
            const oldestKey = this.jobs.keys().next().value;
            this.jobs.delete(oldestKey);
        }
        
        this.render();
    }

    updateJobStatus(jobId, status) {
        if (this.jobs.has(jobId)) {
            const job = this.jobs.get(jobId);
            job.status = status;
            job.lastUpdate = new Date();
            this.render();
        }
    }

    render() {
        const jobsList = document.getElementById('jobsList');
        jobsList.innerHTML = '';
        
        // Show most recent jobs first
        const sortedJobs = Array.from(this.jobs.values())
            .sort((a, b) => b.submittedAt - a.submittedAt)
            .slice(0, 5);
        
        if (sortedJobs.length === 0) {
            jobsList.innerHTML = '<p style="color: #666; text-align: center;">No jobs submitted yet</p>';
            return;
        }
        
        sortedJobs.forEach(job => {
            const jobCard = this.createJobCard(job);
            jobsList.appendChild(jobCard);
        });
    }

    createJobCard(job) {
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
            this.onJobSelected(job.id);
        });
        
        return jobCard;
    }

    getJob(jobId) {
        return this.jobs.get(jobId);
    }

    getAllJobs() {
        return Array.from(this.jobs.values());
    }
}