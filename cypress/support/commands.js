// Custom Cypress commands for our application

/**
 * Submit a computation job through the UI
 */
Cypress.Commands.add('submitJob', (numbers, operation = 'square') => {
  cy.get('#numbers').clear().type(numbers)
  cy.get('#operation').select(operation)
  cy.get('#submitBtn').click()
})

/**
 * Wait for job to complete and verify results
 */
Cypress.Commands.add('waitForJobCompletion', (timeout = 15000) => {
  cy.get('#statusSection', { timeout }).should('be.visible')
  cy.get('#jobStatus', { timeout }).should('contain.text', 'COMPLETED')
})

/**
 * Check if API is healthy
 */
Cypress.Commands.add('checkApiHealth', () => {
  cy.request('GET', 'http://localhost:8000/').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.have.property('message')
  })
})