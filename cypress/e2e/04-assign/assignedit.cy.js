/// <reference types="cypress" />

function selectLine(line) {
  cy.gett('assignedit').should('not.exist');
  cy.gett("assignlister")
    .get('table')
    .get('tbody')
    .get('tr').should('have.length', 4).eq(line)
    .click();
}

describe('assignment', () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:9000/accountrecord/unassigned', { fixture: 'unassignedrecords.json' });
    cy.intercept('GET', 'http://localhost:9000/accountrecord/id/71', { fixture: 'accountrecord71.json' });
    cy.intercept('GET', '/production', 'true').as('prodcall');

    cy.intercept('GET', 'http://localhost:9000/category/subenumfavorite', { fixture: 'catfavorites.json' });
    cy.intercept('GET', 'http://localhost:9000/category/catenum/true', { fixture: 'categories.json' });
    cy.intercept('GET', 'http://localhost:9000/category/suball', { fixture: 'subcategories.json' });
    cy.intercept('GET', 'http://localhost:9000/category/subenum/1/true', { fixture: 'subcategories1.json' }).as('subenum1');
    cy.intercept('GET', 'http://localhost:9000/category/subenum/2/true', { fixture: 'subcategories2.json' }).as('subenum2');
    cy.intercept('GET', 'http://localhost:9000/plans/unassigned/*/*', { fixture: 'plans.json' }).as('plansloaded');
    cy.visit('http://localhost:9000/');
    cy.wait('@prodcall');
    cy.gett('assign').click();
  })


  it("cancel category assignemnt", () => {
    cy.intercept('POST', 'http://localhost:9000/assign/tosubcategory', () => { throw new Error('assign called on cancel') })
    cy.intercept('POST', 'http://localhost:9000/assign/toplan', () => { throw new Error('assign called on cancel') })
    selectLine(1);
    cy.gett('assign.cat').click();
    cy.gett('typebutton').should('have.text', 'Kategorie');
    cy.gett('categoryselect').get('select').eq(0).invoke('val').should('equal', '1');
    cy.gett('categoryselect').get('select').eq(1).invoke('val').should('equal', '11');
    cy.gett('assign.cancel').click();
  })

  it("cancel plan assignment", () => {
    cy.intercept('POST', 'http://localhost:9000/assign/tosubcategory', () => { throw new Error('assign called on cancel') })
    cy.intercept('POST', 'http://localhost:9000/assign/toplan', () => { throw new Error('assign called on cancel') })
    selectLine(1);
    cy.gett('assign.plan').click();
    cy.gett('typebutton').should('have.text', 'Plan');
    cy.gett('planlister').find('tbody').find('tr').should('have.length', 2);
    cy.gett('assign.cancel').click();
  })

  it("switch plan/cat assignemnt", () => {
    selectLine(1);
    cy.gett('assign.plan').click();

    //select plan
    cy.gett('typebutton').should('have.text', 'Plan');
    cy.gett('planlister').find('tbody').find('tr').eq(1)
      .should('have.css', 'background-color', 'rgb(176, 196, 222)');
    cy.gett('planlister').find('tbody').find('tr')
      .should('have.length', 2).eq(1).click();
    cy.gett('planlister').find('tbody').find('tr').eq(1)
      .should('have.css', 'background-color', 'rgb(240, 240, 240)');

    // switch
    cy.gett('typebutton').click();
    cy.gett('typebutton').should('have.text', 'Kategorie');

    // select category
    cy.gett('categoryselect').get('select').eq(0).select('2');
    cy.wait('@subenum2');
    cy.gett('categoryselect').get('select').eq(1).select('23');
    cy.gett('categoryselect').get('input').type('something weird');

    // switch
    cy.gett('typebutton').click();
    cy.gett('typebutton').should('have.text', 'Plan');

    // check selected plan
    cy.gett('planlister').find('tbody').find('tr').eq(1)
      .should('have.css', 'background-color', 'rgb(240, 240, 240)');

    // switch
    cy.gett('typebutton').click();
    cy.gett('typebutton').should('have.text', 'Kategorie');

    // check categorie
    cy.gett('categoryselect').get('select').eq(0).invoke('val').should('equal', '2');
    cy.gett('categoryselect').get('select').eq(1).invoke('val').should('equal', '23');
    cy.gett('categoryselect').get('input').should('have.value','something weird');
  })

  it('show and hide account record via expand button', () => {
    // select a row to open the assign editor
    selectLine(1);

    // open the assign editor by clicking the plan action (assign editor is shown when an action is set)
    cy.gett('assign.plan').click();
    // ensure the assign editor is visible
    cy.gett('assignedit').should('exist');

    // open the details using the expand button and assert visible
    cy.gett('assignedit').find('[testdata-id="assignedit.expand"]').click();
    cy.gett('assignedit').should('contain.text', 'Rent for 08-2025');
    cy.gett('assignedit').should('contain.text', 'Home Owner');

    // collapse again using the close button test id and assert record info is hidden
    cy.gett('assignedit').find('[testdata-id="assignedit.expand"]').click();
    cy.gett('assignedit').should('not.contain.text', 'Rent for 08-2025');
  })

  it('assign to category', () => {

    // open assigneditor for line to to assign cat
    selectLine(2);
    cy.gett('assign.cat').click();

    // select cat 
    cy.gett('categoryselect').get('select').eq(0).select('2');
    cy.wait('@subenum2');
    cy.gett('categoryselect').get('select').eq(1).select('22');

    // switch to plan and back
    cy.gett('typebutton').click();
    cy.gett('typebutton').should('have.text', 'Plan');
    cy.wait('@plansloaded');
    cy.gett('typebutton').click();
    cy.gett('typebutton').should('have.text', 'Kategorie');
  })
})
