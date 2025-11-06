// Cypress support file for E2E tests

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from command log to reduce noise
Cypress.on('window:before:load', (win) => {
  // Stub console methods to reduce noise in test output
  cy.stub(win.console, 'log').as('consoleLog')
  cy.stub(win.console, 'error').as('consoleError')
})

// Global error handling
Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevent Cypress from failing the test on uncaught exceptions
  // that might come from the application
  return false
})