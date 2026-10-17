/// <reference types="cypress" />

const { formatISO } = require("date-fns");

function interceptDefSave(option) {
  var today = formatISO(new Date()).substring(0, 10);
  cy.intercept("POST", "templates/save", (req) => {
    expect(req.body.id).not.to.exist;
    expect(req.body.shortdescription).eq("Neu");
    expect(req.body.validFrom).eq(today);
    expect(req.body.validUntil).not.to.exist;
    expect(req.body.start).eq(today);
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

    cy.intercept("GET", "templates//listcategory/1", {
      fixture: "templatelist.json",
    });

    cy.intercept("GET", "production", "true").as("prodcall");

    cy.visit("http://localhost:9000/");
    cy.wait("@prodcall");
    cy.gett("plan").click();
    cy.gett("templates").findt("templateeditor").as("editor");
  });

  it("create template", () => {
    cy.wait("@subenum1");
    cy.get("@editor").findt("catselector").select("Cat - 2");
    cy.wait("@subenum2");
    interceptDefSave(21);
    cy.get("@editor").gett("savebutton").click();
    cy.wait("@subenum1");
    interceptDefSave(11);
    cy.get("@editor").gett("savebutton").click();
  });

  it("template creation with values", () => {
    cy.wait("@subenum1");
    cy.get("@editor").findt("catselector").select("Cat - 2");
    cy.wait("@subenum2");
    cy.get("@editor").findt("subselector").select("SubCat - 2.2");
    cy.get("@editor").findt("shortdescription").type(" something");
    cy.get("@editor").findt("description").type(" something longer");
    cy.get("@editor")
      .findt("validfrom")
      .type("{selectall}{backspace}09.01.2023");
    cy.get("@editor")
      .findt("validuntil")
      .type("{selectall}{backspace}10.02.2023");
    cy.get("@editor")
      .findt("firstday")
      .type("{selectall}{backspace}11.04.2023");
    cy.get("@editor").findt("variance").type("{selectall}{backspace}6");
    cy.get("@editor").findt("repeatcount").type("{selectall}{backspace}3");
    cy.get("@editor").findt("timeunit").select("Woche");
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
    cy.get("@editor").findt("value").type("{selectall}{backspace}230.52");
    cy.get("@editor").findt("matchstyle").select("Muster");
    cy.get("@editor").findt("catselector").select("Cat - 2");
    cy.get("@editor").findt("subselector").select("SubCat - 2.2");

    var today = new Date();
    cy.intercept("POST", "templates/save", (req) => {
      expect(req.body.id).not.to.exist;
      expect(req.body.shortdescription).eq("Neu something");
      expect(req.body.description).eq("Neue Vorlage something longer");
      expect(req.body.validFrom).eq("2023-01-09");
      expect(req.body.validUntil).eq("2023-02-10");
      expect(req.body.start).eq("2023-04-11");
      expect(req.body.variance).eq(6);
      expect(req.body.repeatcount).eq(3);
      expect(req.body.repeatunit).eq(1);
      expect(req.body.subcategory).eq(22);
      expect(req.body.position).eq(2);
      expect(req.body.value).eq(23052);
      expect(req.body.pattern.sender).eq("sender");
      expect(req.body.pattern.receiver).eq("receiver");
      expect(req.body.pattern.referenceID).eq("referenceID");
      expect(req.body.pattern.mandate).eq("mandate");
      expect(req.body.pattern.senderID).eq("submitter");
      expect(req.body.pattern.details).eq("details");
      expect(req.body.matchstyle).eq(3);
      expect(req.body.subcategory).eq(22);
      expect(req.body.previous).not.to.exist;
      expect(req.body.additional).eq("");
      req.continue((res) => {
        res.body = "2";
        res.statusCode = 200;
      });
    });
    cy.get("@editor").findt("savebutton").click();
  });

  it("change template", () => {
    cy.gett("templates").findline("templateslister", 2).click();
    cy.get("@editor")
      .findt("shortdescription")
      .type("{selectall}{backspace}else");
    cy.get("@editor").findt("description").type(" {backspace}");

    cy.intercept("POST", "templates/save", (req) => {
      expect(req.body.id).eq(34);
      expect(req.body.shortdescription).eq("else");
      expect(req.body.description).eq("Neue Vorlage 3");
      expect(req.body.validFrom).eq("2026-10-16");
      expect(req.body.validUntil).eq("2026-10-18");
      expect(req.body.start).eq("2026-10-19");
      expect(req.body.variance).eq(2);
      expect(req.body.repeatcount).eq(2);
      expect(req.body.repeatunit).eq(3);
      expect(req.body.subcategory).eq(22);
      expect(req.body.position).eq(2);
      expect(req.body.value).eq(234);
      expect(req.body.pattern.sender).eq("5");
      expect(req.body.pattern.receiver).eq("3");
      expect(req.body.pattern.referenceID).eq("4");
      expect(req.body.pattern.mandate).eq("2");
      expect(req.body.pattern.senderID).eq("6");
      expect(req.body.pattern.details).eq("1");
      expect(req.body.matchstyle).eq(1);
      expect(req.body.subcategory).eq(22);
      expect(req.body.previous).eq(15);
      expect(req.body.additional).eq("5");
      req.continue((res) => {
        res.body = "2";
        res.statusCode = 200;
      });
    });
    cy.get("@editor").findt("savebutton").click();
  });

  it("new template", () => {
    cy.gett("templates").findline("templateslister", 2).click();
    cy.get("@editor").findt("newbutton").click();
    cy.intercept("POST", "templates/save", (req) => {
      expect(req.body.id).not.to.exist;
      expect(req.body.shortdescription).eq("Neu");
      req.continue((res) => {
        res.body = "2";
        res.statusCode = 200;
      });
    });
    cy.get("@editor").findt("savebutton").click();
  });

  it("copy template", () => {
    cy.gett("templates").findline("templateslister", 2).click();
    cy.get("@editor").findt("copybutton").click();

    cy.intercept("POST", "templates/save", (req) => {
      expect(req.body.id).not.to.exist;
      expect(req.body.shortdescription).eq("copy of Neu 2");
      expect(req.body.description).eq("Neue Vorlage 3");
      expect(req.body.validFrom).eq("2026-10-16");
      expect(req.body.validUntil).eq("2026-10-18");
      expect(req.body.start).eq("2026-10-19");
      expect(req.body.variance).eq(2);
      expect(req.body.repeatcount).eq(2);
      expect(req.body.repeatunit).eq(3);
      expect(req.body.subcategory).eq(22);
      expect(req.body.position).eq(2);
      expect(req.body.value).eq(234);
      expect(req.body.pattern.sender).eq("5");
      expect(req.body.pattern.receiver).eq("3");
      expect(req.body.pattern.referenceID).eq("4");
      expect(req.body.pattern.mandate).eq("2");
      expect(req.body.pattern.senderID).eq("6");
      expect(req.body.pattern.details).eq("1");
      expect(req.body.matchstyle).eq(1);
      expect(req.body.subcategory).eq(22);
      expect(req.body.previous).eq(15);
      expect(req.body.additional).eq("5");
      req.continue((res) => {
        res.body = "2";
        res.statusCode = 200;
      });
    });
    cy.get("@editor").findt("savebutton").click();
  });

  it("delete template", () => {
    cy.gett("templates").findline("templateslister", 2).click();
    cy.intercept("GET", "templates/delete/34", (req) => {
      req.continue((res) => {
        res.statusCode = 200;
      });
    }).as("deletetemplate");
    cy.get("@editor").findt("deletebutton").click();
    cy.wait("@deletetemplate");
  });
});
