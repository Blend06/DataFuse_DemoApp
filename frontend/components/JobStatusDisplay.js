class JobStatusDisplay {
    constructor() {
        this.elements = {
            statusSection: document.getElementById('statusSection'),
            jobId: document.getElementById('jobId'),
            jobStatus: document.getElementById('jobStatus'),
            progressContainer: document.getElementById('progressContainer'),
            progressFill: document.getElementById('progressFill'),
            progressText: document.getElementById('progressText'),
            resultsContainer: document.getElementById('resultsContainer'),
            results: document.getElementById('results'),
            errorContainer: document.getElementById('errorContainer'),
            errorMessage: document.getElementById('errorMessage')
        };
    }

    show(jobId) {
        this.elements.statusSection.style.display = 'block';
        this.elements.jobId.textContent = jobId;
        this.reset();
    }

    reset() {
        this.elements.progressContainer.style.display = 'none';
        this.elements.resultsContainer.style.display = 'none';
        this.elements.errorContainer.style.display = 'none';
    }

    updateStatus(jobData) {
        this.elements.jobStatus.textContent = jobData.status.toUpperCase();
        this.elements.jobStatus.className = `status-badge status-${jobData.status}`;
        
        switch (jobData.status) {
            case 'running':
                this.showProgress(jobData);
                break;
            case 'completed':
                this.showResults(jobData);
                break;
            case 'failed':
                this.showError(jobData);
                break;
        }
    }

    showProgress(jobData) {
        this.elements.progressContainer.style.display = 'block';
        
        const progress = jobData.progress || 0;
        this.elements.progressFill.style.width = `${progress}%`;
        this.elements.progressText.textContent = 
            `${progress}% (${jobData.completed || 0}/${jobData.total || 0})`;
    }

    showResults(jobData) {
        this.elements.progressContainer.style.display = 'none';
        this.elements.resultsContainer.style.display = 'block';
        
        this.elements.results.innerHTML = '';
        
        if (jobData.results) {
            jobData.results.forEach(result => {
                const resultItem = document.createElement('div');
                resultItem.className = 'result-item';
                resultItem.innerHTML = `
                    <span>Input: ${result.input}</span>
                    <span>Output: ${result.output}</span>
                `;
                this.elements.results.appendChild(resultItem);
            });
        }
    }

    showError(jobData) {
        this.elements.progressContainer.style.display = 'none';
        this.elements.errorContainer.style.display = 'block';
        this.elements.errorMessage.textContent = jobData.error || 'Unknown error occurred';
    }
}