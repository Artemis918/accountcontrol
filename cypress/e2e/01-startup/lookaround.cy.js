/// <reference types="cypress" />

describe('startup accountcontrol', () => {
  beforeEach(() => {
    cy.visit('http://localhost:9000')
  })

  it("look for the language and change it", () => {
    cy.get('#planbutton').should('have.text', 'Planen');
    cy.get('#langselect').select('en');
    cy.get('#planbutton').should('have.text', 'Planing');

  })
})
