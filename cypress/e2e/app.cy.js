describe('Distributed Computation Demo', () => {
    beforeEach(() => {
        // Check if API is running before each test
        cy.checkApiHealth()

        // Visit the application
        cy.visit('/')
    })

    it('should load the application correctly', () => {
        // Check page title and main elements
        cy.title().should('contain', 'Distributed Computation Demo')
        cy.get('h1').should('contain', 'Distributed Computation Demo')

        // Check form elements are present
        cy.get('#jobForm').should('be.visible')
        cy.get('#numbers').should('be.visible')
        cy.get('#operation').should('be.visible')
        cy.get('#submitBtn').should('be.visible').and('contain.text', 'Start Computation')
    })

    it('should have default values in the form', () => {
        // Check default values
        cy.get('#numbers').should('have.value', '1,2,3,4,5,10,15,20')
        cy.get('#operation').should('have.value', 'square')
    })

    it('should submit a job and show status updates', () => {
        // Submit a job
        cy.submitJob('1,2,3,4,5')

        // Check that status section appears
        cy.get('#statusSection').should('be.visible')
        cy.get('#jobId').should('not.be.empty')

        // Check that status badge exists and has valid content
        cy.get('#jobStatus').should('exist').and('not.be.empty')

        // Check that the status is one of the expected values
        cy.get('#jobStatus').should(($el) => {
            const text = $el.text().trim()
            expect(text).to.be.oneOf(['PENDING', 'RUNNING', 'COMPLETED'])
        })

        // Eventually the job should complete
        cy.get('#jobStatus', { timeout: 10000 }).should('contain.text', 'COMPLETED')
    })

    it('should complete a job and show results', () => {
        // Submit a small job that completes quickly
        cy.submitJob('2,3')

        // Wait for completion
        cy.waitForJobCompletion()

        // Check results are displayed
        cy.get('#resultsContainer').should('be.visible')
        cy.get('#results').should('be.visible')

        // Check that results contain expected values for square operation
        cy.get('.result-item').should('have.length', 2)
        cy.get('.result-item').first().should('contain.text', 'Input: 2')
        cy.get('.result-item').first().should('contain.text', 'Output: 4')
    })

    it('should handle different operations', () => {
        // Test factorial operation
        cy.submitJob('3,4', 'factorial')

        cy.waitForJobCompletion()

        // Check factorial results
        cy.get('.result-item').should('have.length', 2)
        cy.get('.result-item').first().should('contain.text', 'Input: 3')
        cy.get('.result-item').first().should('contain.text', 'Output: 6') // 3! = 6
    })

    it('should show job history', () => {
        // Submit a job
        cy.submitJob('5')

        // Wait for it to appear in history
        cy.get('#jobsList').should('be.visible')
        cy.get('.job-card').should('have.length.at.least', 1)

        // Check job card content
        cy.get('.job-card').first().should('contain.text', 'Job')
        cy.get('.job-card').first().should('contain.text', 'Numbers: 5')
        cy.get('.job-card').first().should('contain.text', 'Operation: square')
        cy.get('.job-card').first().should('contain.text', 'Status:')
    })

    it('should handle form validation', () => {
        // Try to submit empty numbers
        cy.get('#numbers').clear()
        cy.get('#submitBtn').click()

        // Should show validation alert (we'll check that form doesn't submit)
        cy.get('#statusSection').should('not.be.visible')

        // Try invalid numbers
        cy.get('#numbers').type('abc,def')
        cy.get('#submitBtn').click()

        // Should show validation alert
        cy.get('#statusSection').should('not.be.visible')
    })

    it('should allow clicking on job history to view details', () => {
        // Submit and complete a job first
        cy.submitJob('7')
        cy.waitForJobCompletion()

        // Submit another job
        cy.submitJob('8')

        // Click on the first job in history
        cy.get('.job-card').first().click()

        // Should show the job details
        cy.get('#statusSection').should('be.visible')
        cy.get('#jobId').should('not.be.empty')
    })
})