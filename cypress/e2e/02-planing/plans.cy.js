/// <reference types="cypress" />

const { formatISO } = require("date-fns");

function interceptDefSave(option) {
  var today = formatISO(new Date()).substring(0, 10);
  cy.intercept("POST", "plans/save", (req) => {
    expect(req.body.id).not.to.exist;
    expect(req.body.shortdescription).eq("Neu");
    expect(req.body.startdate).eq(today);
    expect(req.body.plandate).eq(today);
    expect(req.body.enddate).eq(today);
    expect(req.body.description).eq("Neuer Plan");
    expect(req.body.subcategory).eq(option);
    expect(req.body.position).eq(0);
    expect(req.body.value).eq(0);
    expect(req.body.pattern.details).eq("");
    expect(req.body.pattern.sender).eq("");
    expect(req.body.pattern.senderID).eq("");
    expect(req.body.pattern.receiver).eq("");
    expect(req.body.pattern.referenceID).eq("");
    expect(req.body.pattern.mandate).eq("");
    expect(req.body.matchstyle).eq(0);
    req.continue((res) => {
      res.body = "2";
      res.statusCode = 200;
    });
  }).as("createplan");
}

describe("plan creation", () => {
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

    cy.intercept("GET", "/plans/list/*/*", (req) => {
      var fname = "plans1.json";
      if (req.url.endsWith("plans/list/2023/8")) {
        fname = "plans.json";
      }
      req.reply({
        fixture: fname,
      });
    });

    cy.intercept("GET", "production", "true").as("prodcall");

    cy.visit("http://localhost:9000/");
    cy.wait("@prodcall");
    cy.gett("plan").click();
    cy.gett("tabBut_Plan").click();
    cy.wait("@subenum1");
    cy.gett("plans").findt("planeditor").as("editor");
  });

  it.skip("create plan", () => {
    cy.get("@editor").findt("catselector").select("Cat - 2");
    cy.wait("@subenum2");
    interceptDefSave(21);
    cy.get("@editor").gett("savebutton").click();
    cy.wait(1);
    interceptDefSave(11);
    cy.get("@editor").gett("savebutton").click();
  });

  it.skip("plan creation with values", () => {
    cy.get("@editor").findt("catselector").select("Cat - 2");
    cy.wait("@subenum2");
    cy.get("@editor").findt("subselector").select("SubCat - 2.2");
    cy.get("@editor")
      .findt("shortdescription")
      .type("{selectall}{backspace}something");
    cy.get("@editor")
      .findt("description")
      .type("{selectall}{backspace}something longer");
    cy.get("@editor")
      .findt("firstday")
      .type("{selectall}{backspace}09.01.2023");
    cy.get("@editor").findt("planday").type("{selectall}{backspace}10.01.2023");
    cy.get("@editor").findt("endday").type("{selectall}{backspace}11.01.2023");
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

    var today = new Date();
    cy.intercept("POST", "plans/save", (req) => {
      expect(req.body.id).not.to.exist;
      expect(req.body.shortdescription).eq("something");
      expect(req.body.description).eq("something longer");
      expect(req.body.startdate).eq("2023-01-09");
      expect(req.body.plandate).eq("2023-01-10");
      expect(req.body.enddate).eq("2023-01-11");
      expect(req.body.subcategory).eq(22);
      expect(req.body.position).eq(2);

      expect(req.body.value).eq(23052);
      expect(req.body.pattern.details).eq("details");
      expect(req.body.pattern.sender).eq("sender");
      expect(req.body.pattern.senderID).eq("submitter");
      expect(req.body.pattern.receiver).eq("receiver");
      expect(req.body.pattern.referenceID).eq("referenceID");
      expect(req.body.pattern.mandate).eq("mandate");
      expect(req.body.matchstyle).eq(3);
      req.continue((res) => {
        res.body = "2";
        res.statusCode = 200;
      });
    });
    cy.get("@editor").findt("savebutton").click();
  });

  it.skip("change plan", () => {
    cy.gett("plans")
      .findt("monthselect-month")
      .type("{selectall}{backspace}07");
    cy.gett("plans")
      .findt("monthselect-year")
      .type("{selectall}{backspace}2023");
    cy.gett("plans").findt("monthdown").click();
    cy.gett("plans").findt("monthup").click().click();
    cy.gett("plans").findline("planslister", 1).click();

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
    cy.wait("@subenum2").then(() => {
      cy.get("@editor")
        .findt("shortdescription")
        .type("{selectall}{backspace}else");
      cy.get("@editor").findt("description").type(" {backspace}");
      cy.get("@editor").findt("savebutton").click();
    });
  });

  it.skip("new plan", () => {
    cy.gett("plans").findline("planslister", 0).click();
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

  it.skip("copy plan", () => {
    cy.gett("plans").findline("planslister", 0).click();
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

  it.skip("delete plan", () => {
    cy.gett("plans").findline("planslister", 0).click();
    cy.intercept("GET", "plans/delete/8", (req) => {
      req.continue((res) => {
        res.statusCode = 200;
      });
    }).as("deleteplan");
    cy.get("@editor").findt("deletebutton").click();
    cy.wait("@deleteplan");
  });

  it("create from template", () => {
    cy.gett("plans").findt("creationpopup-button").click();
    cy.gett("plans").findt("creationpopup").as("popup");
    cy.get("@popup").findt("cancel").click();

    cy.gett("plans").findt("creationpopup-button").click();
    cy.gett("plans").findt("creationpopup").as("popup");
    cy.get("@popup").findt("monthselect-month").type("{selectall}{backspace}1");
    cy.get("@popup")
      .findt("monthselect-year")
      .type("{selectall}{backspace}2021");
    cy.get("@popup").findt("monthdown").click();
    cy.get("@popup").findt("monthup").click().click();

    cy.intercept("GET", "plans/createFromTemplates/2/2021", (req) => {
      req.continue((res) => {
        res.statusCode = 200;
      });
    }).as("created");
    cy.get("@popup").findt("create").click();
    cy.wait("@created");
  });
});
