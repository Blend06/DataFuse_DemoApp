/**
 * Main Application Controller
 * Coordinates all components and manages application state
 */
class App {
    constructor() {
        this.currentJobId = null;
        this.initializeComponents();
    }

    initializeComponents() {
        // Initialize all components
        this.statusDisplay = new JobStatusDisplay();
        this.poller = new JobPoller((jobData) => this.handleStatusUpdate(jobData));
        this.history = new JobHistory((jobId) => this.handleJobSelection(jobId));
        this.submitter = new JobSubmitter((jobData, details) => this.handleJobSubmitted(jobData, details));
    }

    handleJobSubmitted(jobData, jobDetails) {
        this.currentJobId = jobData.job_id;
        
        // Show job status and start polling
        this.statusDisplay.show(jobData.job_id);
        this.poller.start(jobData.job_id);
        
        // Add to history
        this.history.addJob(jobData.job_id, jobDetails);
    }

    handleStatusUpdate(jobData) {
        // Update status display
        this.statusDisplay.updateStatus(jobData);
        
        // Update history
        this.history.updateJobStatus(this.currentJobId, jobData.status);
    }

    handleJobSelection(jobId) {
        this.currentJobId = jobId;
        this.statusDisplay.show(jobId);
        this.poller.start(jobId);
    }
}

// Initialize the application when page loads
document.addEventListener('DOMContentLoaded', () => {
    new App();
});