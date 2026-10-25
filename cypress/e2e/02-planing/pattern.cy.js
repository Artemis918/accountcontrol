/// <reference types="cypress" />

const { formatISO } = require("date-fns");

function interceptDefSave(option) {
  var today = formatISO(new Date()).substring(0, 10);
  cy.intercept("POST", "plans/savePattern", (req) => {
    expect(req.body.id).not.to.exist;
    expect(req.body.shortdescription).eq("Neu");
    expect(req.body.description).eq("Neuer Plan");
    expect(req.body.subcategory).eq(option);
    expect(req.body.position).eq(0);
    expect(req.body.pattern.details).eq("");
    expect(req.body.pattern.sender).eq("");
    expect(req.body.pattern.senderID).eq("");
    expect(req.body.pattern.receiver).eq("");
    expect(req.body.pattern.referenceID).eq("");
    expect(req.body.pattern.mandate).eq("");
    req.continue((res) => {
      res.body = "2";
      res.statusCode = 200;
    });
  }).as("createplan");
}

describe("pattern creation", () => {
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
    cy.intercept("GET", "templates//listcategory/1", {
      fixture: "templatelist.json",
    });

    cy.intercept("GET", "/plans/patternplans/*", (req) => {
      var fname = "patterns1.json";
      if (req.url.endsWith("plans/patternplans/2")) {
        fname = "patterns.json";
      }
      req.reply({
        fixture: fname,
      });
    }).as("patternlist");

    cy.intercept("GET", "production", "true").as("prodcall");

    cy.visit("http://localhost:9000/");
    cy.wait("@prodcall");
    cy.gett("plan").click();
    cy.gett("tabBut_Muster").click();
    cy.wait("@subenum1");
    cy.gett("pattern").findt("patternplaneditor").as("editor");
  });

  it("create pattern plan", () => {
    cy.get("@editor").findt("catselector").select("Cat - 2");
    cy.wait("@subenum2");
    interceptDefSave(21);
    cy.get("@editor").gett("savebutton").click();
    cy.wait(1);
    interceptDefSave(11);
    cy.get("@editor").gett("savebutton").click();
  });

  it("pattern plan creation with values", () => {
    cy.get("@editor").findt("catselector").select("Cat - 2");
    cy.wait("@subenum2");
    cy.get("@editor").findt("subselector").select("SubCat - 2.2");
    cy.get("@editor")
      .findt("shortdescription")
      .type("{selectall}{backspace}something");
    cy.get("@editor")
      .findt("description")
      .type("{selectall}{backspace}something longer");
    cy.get("@editor").findt("patterneditbutton").click();
    cy.get("@editor").findt("patterneditor").as("patterneditor");

    cy.get("@patterneditor").findt("pattern_sender").type("sender");
    cy.get("@patterneditor").findt("pattern_receiver").type("receiver");
    cy.get("@patterneditor").findt("pattern_referenceID").type("referenceID");
    cy.get("@patterneditor").findt("pattern_mandate").type("mandate");
    cy.get("@patterneditor").findt("pattern_submitter").type("submitter");
    cy.get("@patterneditor").findt("pattern_details").type("details");
    cy.get("@patterneditor").findt("patternok").click();

    cy.get("@editor").findt("position").type("{selectall}{backspace}2");
    
    cy.intercept("POST", "plans/savePattern", (req) => {
      expect(req.body.id).not.to.exist;
      expect(req.body.shortdescription).eq("something");
      expect(req.body.description).eq("something longer");
      expect(req.body.subcategory).eq(22);
      expect(req.body.position).eq(2);
       expect(req.body.pattern.details).eq("details");
      expect(req.body.pattern.sender).eq("sender");
      expect(req.body.pattern.senderID).eq("submitter");
      expect(req.body.pattern.receiver).eq("receiver");
      expect(req.body.pattern.referenceID).eq("referenceID");
      expect(req.body.pattern.mandate).eq("mandate");
      req.continue((res) => {
        res.body = "2";
        res.statusCode = 200;
      });
    });
    cy.get("@editor").findt("savebutton").click();
  });

  it("change plan", () => {
    cy.gett("pattern")
      .findt("patternlist")
      .findt("catselector")
      .select("Cat - 2");
    cy.wait("@patternlist");
    cy.gett("pattern").findline("patternlister", 1).click();
    cy.intercept("POST", "plans/save", (req) => {
      expect(req.body.id).eq(9);
      expect(req.body.shortdescription).eq("else");
      expect(req.body.description).eq(
        "compensation for all the headaches I get in this company :-)",
      );
      expect(req.body.startdate).eq("2025-09-28");
      expect(req.body.plandate).eq("2025-10-02");
      expect(req.body.enddate).eq("2025-10-06");
      expect(req.body.subcategory).eq(22);
      expect(req.body.position).eq(1);
      expect(req.body.value).eq(100000);
      expect(req.body.pattern.details).eq("");
      expect(req.body.pattern.sender).eq("My Company");
      expect(req.body.pattern.senderID).eq("");
      expect(req.body.pattern.receiver).eq("");
      expect(req.body.pattern.referenceID).eq("");
      expect(req.body.pattern.mandate).eq("");
      expect(req.body.matchstyle).eq(0);
      req.continue((res) => {
        res.body = "2";
        res.statusCode = 200;
      });
    });
    cy.get("@editor")
      .findt("shortdescription")
      .type("{selectall}{backspace}else");
    cy.get("@editor").findt("description").type(" {backspace}");
    cy.get("@editor").findt("savebutton").click();
  });

  it("new plan", () => {
    cy.gett("pattern").findline("patternlister", 0).click();
    cy.get("@editor").findt("newbutton").click();
    cy.intercept("POST", "plans/save", (req) => {
      expect(req.body.id).not.to.exist;
      expect(req.body.shortdescription).eq("Neu");
      req.continue((res) => {
        res.body = "2";
        res.statusCode = 200;
      });
    });
    cy.get("@editor").findt("savebutton").click();
  });

  it("copy plan", () => {
    cy.gett("pattern").findline("patternlister", 0).click();
    cy.get("@editor").findt("copybutton").click();

    cy.intercept("POST", "plans/save", (req) => {
      expect(req.body.id).not.to.exist;
      expect(req.body.shortdescription).eq("copy of Rent");
      expect(req.body.description).eq("Rent for my appartment in Somewhere");
      expect(req.body.startdate).eq("2025-09-28");
      expect(req.body.plandate).eq("2025-10-02");
      expect(req.body.enddate).eq("2025-10-06");
      expect(req.body.subcategory).eq(11);
      expect(req.body.position).eq(1);
      expect(req.body.value).eq(20000);
      expect(req.body.matchstyle).eq(0);
      expect(req.body.pattern.sender).eq("");
      expect(req.body.pattern.receiver).eq("Landlord");
      expect(req.body.pattern.referenceID).eq("");
      expect(req.body.pattern.mandate).eq("");
      expect(req.body.pattern.senderID).eq("");
      expect(req.body.template).eq(2);
      req.continue((res) => {
        res.body = "2";
        res.statusCode = 200;
      });
    });
    cy.get("@editor").findt("savebutton").click();
  });

  it("delete plan", () => {
    cy.gett("pattern").findline("patternlister", 0).click();
    cy.intercept("GET", "plans/delete/13", (req) => {
      req.continue((res) => {
        res.statusCode = 200;
      });
    }).as("deleteplan");
    cy.get("@editor").findt("deletebutton").click();
    cy.wait("@deleteplan");
  });
});
