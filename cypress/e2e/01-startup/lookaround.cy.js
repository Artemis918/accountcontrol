/// <reference types="cypress" />

describe('startup accountcontrol', () => {
  beforeEach(() => {
    cy.intercept('GET', '/production', 'true');
    cy.visit('http://localhost:9000')
  })

  it(" look for right back-ground", () => {
    cy.get('#main')
      .should('have.css', 'background-color', 'rgb(173, 216, 230)')
  })

  it("look for the language and change it", () => {
    cy.gett('plan').should('have.text', 'Planen');
    cy.gett('langselect').select('en');
    cy.gett('plan').should('have.text', 'Planing');
  })
})
