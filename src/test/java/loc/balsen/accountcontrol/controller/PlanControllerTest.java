package loc.balsen.accountcontrol.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import loc.balsen.accountcontrol.data.Pattern;
import loc.balsen.accountcontrol.data.Plan;
import loc.balsen.accountcontrol.data.Plan.MatchStyle;
import loc.balsen.accountcontrol.data.Template;
import loc.balsen.accountcontrol.data.Template.TimeUnit;
import loc.balsen.accountcontrol.testutil.TestContext;

@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
@WebAppConfiguration
public class PlanControllerTest extends TestContext {

  static private String planjson = "{  " + "\"id\": \"1234\", "
      + "\"creationdate\": \"1797-12-03\", " + "\"startdate\": \"1797-10-03\", "
      + "\"plandate\": \"1797-10-31\", " + "\"enddate\": \"1797-10-03\", "
      + "\"subcategory\": SUBCATEGORY, " + "\"description\": \"Beschreibung\", "
      + "\"shortdescription\": \"Kurz\", " + "\"position\": 5, " + "\"value\": 100, "
      + "\"matchstyle\": 1, " + "\"patterndto\": { " + "  \"sender\": \"sender\", "
      + "  \"receiver\": \"Receiver\", " + "  \"referenceID\": \"Reference\", "
      + "  \"details\": \"*pups*\", " + "  \"mandate\":  \"\" " + "}" + "}";

  @Autowired
  MockMvc mvc;

  @BeforeEach
  public void setup() {
    createCategoryData();
  }

  @AfterEach
  public void teardown() {
    clearRepos();
  }

  private Template template;

  @Test
  public void testSaveAndList() throws Exception {

    String planjsonk = planjson.replace("SUBCATEGORY", Integer.toString(subCategory1.getId()));
    mvc.perform(post("/plans/save").content(planjsonk).contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk());

    List<Plan> plans = planRepository.findAll();
    assertEquals(1, plans.size());
    Plan plan = plans.get(0);
    assertEquals(100, plan.getValue());
    assertEquals(subCategory1.getId(), plan.getSubCategory().getId());

    mvc.perform(get("/plans/list/1797/11")).andExpect(jsonPath("$.[*]", hasSize(0)));

    mvc.perform(get("/plans/list/1797/10")).andExpect(jsonPath("$.[*]", hasSize(1)))
        .andExpect(jsonPath("$.[0].shortdescription").value("Kurz"));

    mvc.perform(get("/plans/delete/" + plan.getId())).andExpect(status().isOk());

    plan = planRepository.findById(plan.getId()).get();
    assertNotNull(plan.getDeactivateDate());

  }

  @Test
  public void testCreateFromTemplate() throws Exception {
    int year = LocalDate.now().getYear() + 1;
    createCategoryData();
    createTemplate(year);

    mvc.perform(get("/plans/createFromTemplates/11/" + year)).andExpect(status().isOk());

    List<Plan> plans = planRepository.findByTemplate(template);
    assertEquals(3, plans.size());
  }


  private void createTemplate(int year) {
    template = new Template(0, LocalDate.of(year, 9, 1), LocalDate.of(year, 12, 31),
        LocalDate.of(year, 9, 15), 5, 1, TimeUnit.MONTH, "Beschreibung", 4, 100, subCategory1,
        new Pattern(" \"sender\": \"sender\", " + " \"receiver\": \"Receiver\", "
            + " \"referenceID\": \"Reference\", " + " \"details\": \"*pups*\", "
            + " \"mandate\": \"\" "),
        "Kurz1234", MatchStyle.EXACT, 0);

    templateRepository.save(template);
  }

}
