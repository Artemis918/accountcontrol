/// <reference types="cypress" />

function selectLine(line) {
  cy.gett("assignlister")
    .get('table')
    .get('tbody')
    .get('tr').should('have.length', 4).eq(line)
    .click();
}

describe('startup assignment', () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:9000/accountrecord/unassigned', { fixture: 'unassignedrecords.json' });
    cy.intercept('GET', 'http://localhost:9000/accountrecord/id/71', { fixture: 'accountrecord71.json' });
    cy.intercept('GET', '/production', 'true');

    cy.intercept('GET', 'http://localhost:9000/category/subenumfavorite', { fixture: 'catfavorites.json' });
    cy.intercept('GET', 'http://localhost:9000/category/catenum/true', { fixture: 'categories.json' });
    cy.intercept('GET', 'http://localhost:9000/category/suball', { fixture: 'subcategories.json' });
    cy.intercept('GET', 'http://localhost:9000/category/subenum/1/true', { fixture: 'subcategories1.json' }).as('subenum1');
    cy.visit('http://localhost:9000/');
    cy.gett('assign').click();
  })


  it("cancel category assignemnt", () => {
    let called=false;
    cy.intercept('POST','http://localhost:9000/assign/tosubcategory',()=>{throw new Error('assign called on cancel')})
    cy.intercept('POST','http://localhost:9000/assign/toplan',()=>{throw new Error('assign called on cancel')})
    cy.gett('assignedit').should('not.exist');
    selectLine(1);
    cy.gett('assign.cat').click();
    cy.gett('typebutton').should('have.text', 'Kategorie');
    cy.gett('categoryselect').get('select').eq(0).invoke('val').should('equal','1');
    cy.gett('categoryselect').get('select').eq(1).invoke('val').should('equal','11');
    cy.gett('assign.cancel').click();
  })


})
