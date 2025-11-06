class JobSubmitter {
    constructor(onJobSubmitted) {
        this.onJobSubmitted = onJobSubmitted;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const form = document.getElementById('jobForm');
        form.addEventListener('submit', (e) => this.handleSubmission(e));
    }

    async handleSubmission(event) {
        event.preventDefault();
        
        const numbersInput = document.getElementById('numbers').value;
        const operation = document.getElementById('operation').value;
        const submitBtn = document.getElementById('submitBtn');
        
        // Parse and validate numbers
        const numbers = this.parseNumbers(numbersInput);
        if (numbers.length === 0) {
            alert('Please enter valid numbers separated by commas');
            return;
        }
        
        // Disable submit button
        this.setSubmitButtonState(true, 'Submitting...');
        
        try {
            const jobData = await this.submitJob(numbers, operation);
            this.onJobSubmitted(jobData, { numbers, operation });
        } catch (error) {
            console.error('Error submitting job:', error);
            alert('Failed to submit job. Make sure the API is running!');
        } finally {
            this.setSubmitButtonState(false, 'Start Computation');
        }
    }

    parseNumbers(input) {
        return input.split(',')
            .map(n => parseInt(n.trim()))
            .filter(n => !isNaN(n));
    }

    async submitJob(numbers, operation) {
        const response = await fetch('http://localhost:8000/jobs', {
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
        
        return await response.json();
    }

    setSubmitButtonState(disabled, text) {
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = disabled;
        submitBtn.textContent = text;
    }
}