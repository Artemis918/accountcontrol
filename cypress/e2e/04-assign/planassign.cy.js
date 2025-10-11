/// <reference types="cypress" />
function url(path) { return 'http://localhost:9000/' + path }

function selectLine(line) {
  cy.gett('assignedit').should('not.exist');
  cy.gett("assignlister")
    .get('table')
    .get('tbody')
    .get('tr').should('have.length', 4).eq(line)
    .click();
}

function selectLineMod(line, mod) {
  cy.gett("assignlister")
    .get('table')
    .get('tbody')
    .get('tr').eq(line)
    .click(mod);
}


describe('assignment', () => {
  beforeEach(() => {
    cy.intercept('GET', 'accountrecord/unassigned', { fixture: 'unassignedrecords.json' }).as('loadunassigned');
    cy.intercept('GET', 'accountrecord/id/71', { fixture: 'accountrecord71.json' });
    cy.intercept('GET', 'accountrecord/id/72', { fixture: 'accountrecord72.json' });
    cy.intercept('GET', 'accountrecord/id/73', { fixture: 'accountrecord73.json' });
    cy.intercept('GET', 'production', 'true').as('prodcall');

    cy.intercept('GET', 'category/subenumfavorite', { fixture: 'catfavorites.json' });
    cy.intercept('GET', 'category/catenum/true', { fixture: 'categories.json' });
    cy.intercept('GET', 'category/suball', { fixture: 'subcategories.json' });
    cy.intercept('GET', 'category/subenum/1/true', { fixture: 'subcategories1.json' }).as('subenum1');
    cy.intercept('GET', 'category/subenum/2/true', { fixture: 'subcategories2.json' }).as('subenum2');
    cy.intercept('GET', 'category/subenum/3/true', { fixture: 'subcategories3.json' }).as('subenum3');
    cy.intercept('GET', 'plans/id/9', { fixture: 'plan9.json' });
    cy.intercept('GET', 'plans/unassigned/*/*', { fixture: 'plans.json' }).as('plansloaded');
    cy.intercept('GET', 'assign/analyze/*/9', { body: { additional: [0, 0] } });
    cy.visit('http://localhost:9000/');
    cy.wait('@prodcall');
    cy.gett('assign').click();
  })

  it('assign plan adjust button visibility', () => {
    // open assigneditor for line to to assign plan
    selectLine(3);
    cy.gett('assign.plan').click();

    // select second plan 
    cy.wait('@plansloaded');
    cy.intercept('GET', 'assign/analyze/*/9', { body: { additional: [0, 0] } });
    cy.gett('planlister').find('tbody').find('tr').eq(1).click();
    cy.gett('assign.adjustpattern').should('not.be.visible');
    cy.gett('assign.adjusttime').should('not.be.visible');
    cy.gett('assign.cancel').click();

    cy.intercept('GET', 'assign/analyze/*/9', { body: { additional: [1, 0] } });
    cy.gett('planlister').find('tbody').find('tr').eq(1).click();
    cy.gett('assign.adjustpattern').should('be.visible');
    cy.gett('assign.adjusttime').should('not.be.visible');
    cy.gett('assign.cancel').click();

    cy.intercept('GET', 'assign/analyze/*/9', { body: { additional: [0, 1] } });
    cy.gett('planlister').find('tbody').find('tr').eq(1).click();
    cy.gett('assign.adjustpattern').should('not.be.visible');
    cy.gett('assign.adjusttime').should('be.visible');
    cy.gett('assign.cancel').click();

    cy.intercept('GET', 'assign/analyze/*/9', { body: { additional: [1, 1] } });
    cy.gett('planlister').find('tbody').find('tr').eq(1).click();
    cy.gett('assign.adjustpattern').should('be.visible');
    cy.gett('assign.adjusttime').should('be.visible');
    cy.gett('assign.cancel').click();
  })

  it('change pattern', () => {
    // open assigneditor for line to to assign plan
    selectLine(3);
    cy.gett('assign.plan').click();
    cy.wait('@plansloaded');

    cy.intercept('GET', 'assign/analyze/*/9', { body: { additional: [1, 0] } });
    cy.gett('planlister').find('tbody').find('tr').eq(1).click();

    cy.intercept('templates/changepattern',
      (req) => { 
        expect(req.body.id).eq(9);
        expect(req.body.patterndto.sender).eq('My Company');
        expect(req.body.patterndto.receiver).eq('text1');
        expect(req.body.patterndto.referenceID).eq('text2');
        expect(req.body.patterndto.mandate).eq('text3');
        expect(req.body.patterndto.senderID).eq('text4');
        expect(req.body.patterndto.details).eq('text5');
        console.log(req.body.patterndto);
        req.continue((res) => {res.body= '1'});
      }
    )
    cy.gett('assign.adjustpattern').click();
    cy.gett('pattern.editor').find('input').eq(0).should('have.value','My Company');
    cy.gett('pattern.editor').find('input').eq(1).type('text1');
    cy.gett('pattern.editor').find('input').eq(2).type('text2');
    cy.gett('pattern.editor').find('input').eq(3).type('text3');
    cy.gett('pattern.editor').find('input').eq(4).type('text4');
    cy.gett('pattern.editor').find('input').eq(5).type('text5');
    cy.gett('pattern.editor').find('button').click();
        
    cy.gett('assign.cancel').click();
  })

  it.skip('change timerange', () => {
    // TODO implement backend
    // open assigneditor for line to to assign plan
    selectLine(3);
    cy.gett('assign.plan').click();
    cy.wait('@plansloaded');

    cy.intercept('GET', 'assign/analyze/*/9', { body: { additional: [0, 1] } });
    cy.gett('planlister').find('tbody').find('tr').eq(1).click();
    cy.gett('assign.adjusttime').click();
    cy.gett('timerange.editor').find('button').eq(3).click();

    cy.gett('assign.cancel').click();
  })
})
