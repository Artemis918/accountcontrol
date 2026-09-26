/// <reference types="cypress" />

function interceptDefSave(option) {
  var today = new Date();
  cy.intercept("POST", "templates/save", (req) => {
    expect(req.body.id).not.to.exist;
    expect(req.body.shortdescription).eq("Neu");
    expect(req.body.validFrom).contain(today.toISOString().substring(0, 10));
    expect(req.body.validUntil).not.to.exist;
    expect(req.body.start).contain(today.toISOString().substring(0, 10));
    expect(req.body.variance).eq(4);
    expect(req.body.repeatcount).eq(1);
    expect(req.body.repeatunit).eq(2);
    expect(req.body.description).eq("Neue Vorlage");
    expect(req.body.subcategory).eq(option);
    expect(req.body.position).eq(1);
    expect(req.body.value).eq(0);
    expect(req.body.pattern.sender).eq("");
    expect(req.body.pattern.receiver).eq("");
    expect(req.body.pattern.referenceID).eq("");
    expect(req.body.pattern.mandate).eq("");
    expect(req.body.pattern.senderID).eq("");
    expect(req.body.matchstyle).eq(0);
    expect(req.body.previous).not.to.exist;
    expect(req.body.additional).eq("");
    req.continue((res) => {
      res.body = "2";
      res.statusCode = 200;
    });
  }).as("createplan");
}

describe("template creation", () => {
  beforeEach(() => {
    cy.intercept("GET", "category/subenumfavorite", {
      fixture: "catfavorites.json",
    });
    cy.intercept("GET", "category/catenum/true", {
      fixture: "categories.json",
    });
    cy.intercept("GET", "category/suball", { fixture: "subcategories.json" });
    cy.intercept("GET", "category/subenum/1/true", {
      fixture: "subcategories1.json",
    }).as("subenum1");
    cy.intercept("GET", "category/subenum/2/true", {
      fixture: "subcategories2.json",
    }).as("subenum2");
    cy.intercept("GET", "category/subenum/3/true", {
      fixture: "subcategories3.json",
    }).as("subenum3");

    cy.intercept("GET", "production", "true").as("prodcall");

    cy.visit("http://localhost:9000/");
    cy.wait("@prodcall");
    cy.gett("plan").click();
  });

  it("create template", () => {
    cy.wait("@subenum1");
    cy.gett("templates")
      .findt("templateeditor")
      .findt("catselector")
      .select("Cat - 2");
    cy.wait("@subenum2");
    interceptDefSave(21);
    cy.gett("templates").gett("templateeditor").gett("savebutton").click();
    cy.wait("@subenum1");
    interceptDefSave(11);
    cy.gett("templates").gett("templateeditor").gett("savebutton").click();
  })

  it('template creation with values', () =>
  {
    cy.gett("templates").findt("templateeditor").as('editor');
    cy.wait("@subenum1");
    cy.get('@editor').findt('catselector').select('Cat - 2');
    cy.wait('@subenum2');
    cy.get('@editor').findt('subselector').select('SubCat - 2.2');
    cy.get('@editor').findt('shortdescription').type(' something');
    cy.get('@editor').findt('description').type(' something longer');
    var today = new Date();
    cy.intercept("POST", "templates/save", (req) => {
      expect(req.body.id).not.to.exist;
      expect(req.body.shortdescription).eq("Neu something");
      expect(req.body.description).eq("Neue Vorlage something longer");
      expect(req.body.validFrom).contain(today.toISOString().substring(0, 10));
      expect(req.body.validUntil).not.to.exist;
      expect(req.body.start).contain(today.toISOString().substring(0, 10));
      expect(req.body.variance).eq(4);
      expect(req.body.repeatcount).eq(1);
      expect(req.body.repeatunit).eq(2);
      expect(req.body.subcategory).eq(22);
      expect(req.body.position).eq(1);
      expect(req.body.value).eq(0);
      expect(req.body.pattern.sender).eq("");
      expect(req.body.pattern.receiver).eq("");
      expect(req.body.pattern.referenceID).eq("");
      expect(req.body.pattern.mandate).eq("");
      expect(req.body.pattern.senderID).eq("");
      expect(req.body.matchstyle).eq(0);
      expect(req.body.previous).not.to.exist;
      expect(req.body.additional).eq("");
      req.continue((res) => {
        res.body = "2";
        res.statusCode = 200;
      });
    }).as("createplan");
    cy.gett("templates").gett("templateeditor").gett("savebutton").click();
  })
})
