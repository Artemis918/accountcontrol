/// <reference types="cypress" />
function url(path ) { return'http://localhost:9000/' + path}
 
function selectLine(line) {
  cy.gett('assignedit').should('not.exist');
  cy.gett("assignlister")
    .get('table')
    .get('tbody')
    .get('tr').should('have.length', 4).eq(line)
    .click();
}

function selectLineMod(line,mod) {
  cy.gett("assignlister")
    .get('table')
    .get('tbody')
    .get('tr').eq(line)
    .click(mod);
}


describe('assignment', () => {
  beforeEach(() => {
    cy.intercept('GET', 'accountrecord/unassigned', { fixture: 'unassignedrecords.json' }).as ('loadunassigned');
    cy.intercept('GET', 'accountrecord/id/71', { fixture: 'accountrecord71.json' });
        cy.intercept('GET', 'accountrecord/id/72', { fixture: 'accountrecord72.json' });
    cy.intercept('GET', 'production', 'true').as('prodcall');

    cy.intercept('GET', 'category/subenumfavorite', { fixture: 'catfavorites.json' });
    cy.intercept('GET', 'category/catenum/true', { fixture: 'categories.json' });
    cy.intercept('GET', 'category/suball', { fixture: 'subcategories.json' });
    cy.intercept('GET', 'category/subenum/1/true', { fixture: 'subcategories1.json' }).as('subenum1');
    cy.intercept('GET', 'category/subenum/2/true', { fixture: 'subcategories2.json' }).as('subenum2');
    cy.intercept('GET', 'category/subenum/3/true', { fixture: 'subcategories3.json' }).as('subenum3');
    cy.intercept('GET', 'plans/id/9', { fixture: 'plan9.json' });
    cy.intercept('GET', 'plans/unassigned/*/*', { fixture: 'plans.json' }).as('plansloaded');
    cy.intercept('GET', 'assign/analyze/71/9', { body: { additional : [ 0 , 0 ]}});
    cy.visit('http://localhost:9000/');
    cy.wait('@prodcall');
    cy.gett('assign').click();
  })


  it("cancel category assignemnt", () => {
    cy.intercept('POST', 'assign/tosubcategory', () => { throw new Error('assign called on cancel') })
    cy.intercept('POST', 'assign/toplan', () => { throw new Error('assign called on cancel') })
    selectLine(1);
    cy.gett('assign.cat').click();
    cy.gett('typebutton').should('have.text', 'Kategorie');
    cy.gett('categoryselect').get('select').eq(0).invoke('val').should('equal', '1');
    cy.gett('categoryselect').get('select').eq(1).invoke('val').should('equal', '11');
    cy.gett('assign.cancel').click();
  })

  it("cancel plan assignment", () => {
    cy.intercept('POST', 'assign/tosubcategory', () => { throw new Error('assign called on cancel') })
    cy.intercept('POST', 'assign/toplan', () => { throw new Error('assign called on cancel') })
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
    cy.gett('categoryselect').get('input').type('something normal');

    // switch to plan and back
    cy.gett('typebutton').click();
    cy.gett('typebutton').should('have.text', 'Plan');
    cy.wait('@plansloaded');
    cy.gett('typebutton').click();
    cy.gett('typebutton').should('have.text', 'Kategorie');

    cy.intercept('assign/tosubcategory', (req) => {
      expect(req.body.text).to.equal('something normal');
      expect(req.body.subcategory).to.equal(22);
      expect(req.body.ids.length).to.equal(1);
      expect(req.body.ids[0]).to.equal(72);
      req.continue(res => {
         res.body = '234';
      })
    })
    cy.gett('assign.assign').click();
    cy.wait('@loadunassigned');
  })


  it('multiple assign to category', () => {

    // open assigneditor for line to to assign cat
    selectLine(3);
    selectLineMod(1,{shiftKey: true});

    cy.gett('assign.cat').click();

    // select cat 
    cy.gett('categoryselect').get('select').eq(0).select('3');
    cy.wait('@subenum3');
    // subcat 32 is the one and only. Therefore no select necessary 
    // cy.gett('categoryselect').get('select').eq(1).select('31');
    cy.gett('categoryselect').get('input').type('something else');

    // switch to plan and back
    cy.intercept('assign/tosubcategory', (req) => {
      expect(req.body.text).to.equal('something else');
      expect(req.body.subcategory).to.equal(31);
      expect(req.body.ids.length).to.equal(3);
      expect(req.body.ids[0]).to.equal(71);
      expect(req.body.ids[1]).to.equal(72);
      expect(req.body.ids[2]).to.equal(73);
      req.continue(res => {
         res.body = '234';
      })
    })
    cy.gett('assign.assign').click();
    cy.wait('@loadunassigned');
  })


})
