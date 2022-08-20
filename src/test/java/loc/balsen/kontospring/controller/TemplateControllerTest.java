package loc.balsen.kontospring.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.junit.jupiter.api.Assertions.assertEquals;
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
import org.springframework.test.web.servlet.MvcResult;
import loc.balsen.kontospring.data.AccountRecord;
import loc.balsen.kontospring.data.Template;
import loc.balsen.kontospring.testutil.TestContext;

@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
@WebAppConfiguration
public class TemplateControllerTest extends TestContext {

  static private String templatejson = "{  " + "\"validfrom\": \"2018-12-03\", "
      + "\"validuntil\": \"\", " + "\"start\": \"2018-10-03\", " + "\"variance\": 5, "
      + "\"repeatcount\": 1," + "\"repeatunit\": 2, " + "\"subcategory\": SUBCATEGORY, "
      + "\"category\": 1, " + "\"description\": \"Beschreibung\", "
      + "\"shortdescription\": \"Kurz\", " + "\"position\": 5, " + "\"value\": 100, "
      + "\"matchstyle\": 1, " + "\"pattern\": { " + "  \"sender\": \"Sender\", "
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


  @Test
  public void testSaveAndList() throws Exception {

    String tempjson1 = templatejson.replace("SUBCATEGORY", Integer.toString(subCategory1.getId()));

    mvc.perform(post("/templates/save").content(tempjson1).contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk());

    List<Template> templates = templateRepository.findAll();
    assertEquals(1, templates.size());
    Template template = templates.get(0);
    assertEquals(100, template.getValue());
    assertEquals(subCategory1.getId(), template.getSubCategory().getId());

    mvc.perform(get("/templates/listcategory/1")).andExpect(jsonPath("$.[*]", hasSize(1)));

    String tempjson2 = tempjson1.replace("\"repeatcount\": 1,", "\"repeatcount\": 0,");
    MvcResult result = mvc
        .perform(post("/templates/save").content(tempjson2).contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk()).andReturn();
    assertEquals("\"invaliddata\"", result.getResponse().getContentAsString());

    templates = templateRepository.findAll();
    assertEquals(1, templates.size());
  }



  @Test
  public void testCreateFromAccountRecord() throws Exception {
    AccountRecord record = new AccountRecord();
    record.setSender("hallo");
    record.setCreated(LocalDate.of(1998, 4, 2));
    record.setDetails("whatever you will");
    record.setSubmitter("submitterID");
    record.setReceiver("receiver");
    record.setMandate("mandate");
    record.setReference("refernceID");
    record.setValue(200);
    record.setExecuted(LocalDate.of(2000, 4, 2));
    accountRecordRepository.save(record);

    mvc.perform(get("/templates/accountrecord/" + record.getId()))
        .andExpect(jsonPath("$.pattern.sender").value("hallo"))
        .andExpect(jsonPath("$.pattern.details").value("whatever you will"))
        .andExpect(jsonPath("$.pattern.senderID").value("submitterID"))
        .andExpect(jsonPath("$.pattern.receiver").value("receiver"))
        .andExpect(jsonPath("$.pattern.mandate").value("mandate"))
        .andExpect(jsonPath("$.pattern.referenceID").value("refernceID"))
        .andExpect(jsonPath("$.value").value("200"))
        .andExpect(jsonPath("$.start").value("2000-04-02"));
  }
}
