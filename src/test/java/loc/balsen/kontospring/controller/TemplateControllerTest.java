package loc.balsen.kontospring.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.junit.Assert.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.List;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import loc.balsen.kontospring.data.BuchungsBeleg;
import loc.balsen.kontospring.data.Template;
import loc.balsen.kontospring.testutil.TestContext;

@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@WebAppConfiguration
public class TemplateControllerTest extends TestContext {

	static private String templatejson = "{  " + 
			"\"gueltigVon\": \"2018-12-03\", " +
			"\"gueltigBis\": \"\", " +
			"\"start\": \"2018-10-03\", " +
			"\"vardays\": 5, " +
			"\"anzahl\": 1," +
			"\"rythmus\": 2, " +
			"\"subcategory\": SUBCATEGORY, " +
			"\"category\": 1, "+
			"\"description\": \"Beschreibung\", " +
			"\"shortdescription\": \"Kurz\", " +
			"\"position\": 5, " +
			"\"value\": 100, " +
			"\"matchstyle\": 1, " +
			"\"pattern\": { " +
            "  \"sender\": \"Absender\", " +
			"  \"receiver\": \"Empfänger\", " +
            "  \"referenceID\": \"Referenz\", " +
			"  \"details\": \"*pups*\", " +
            "  \"mandat\":  \"\" " +
			"}" +
			"}";
		
	@Autowired
	MockMvc mvc;

	@Before
	public void setup() {
		createCategoryData();
	}
	
	@After
	public void teardown() {
		clearRepos();
	}
	
	
	@Test
	public void testSaveAndList() throws Exception {
		
		String tempjson1 = templatejson.replace("SUBCATEGORY", Integer.toString(subCategory1.getId()));
		
		mvc.perform(post("/templates/save").content(tempjson1).contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk());
		
		List<Template> templates =templateRepository.findAll();
		assertEquals(1,templates.size());
		Template template = templates.get(0);
		assertEquals(100, template.getValue());
		assertEquals(subCategory1.getId(), template.getSubCategory().getId());
		
		mvc.perform(get("/templates/listgroup/1"))
		   .andExpect(jsonPath("$.[*]", hasSize(1)));
	}


	
	@Test
	public void testCreateFromBeleg() throws Exception {
		BuchungsBeleg beleg =  new BuchungsBeleg();
		beleg.setAbsender("hallo");
		beleg.setBeleg(LocalDate.of(1998, 4, 2));
		beleg.setDetails("whatever you will");
		beleg.setEinreicherId("einreicherID");
		beleg.setEmpfaenger("empfänger");
		beleg.setMandat("mandat");
		beleg.setReferenz("refernzID");
		beleg.setWert(200);
		beleg.setWertstellung(LocalDate.of(2000, 4, 2));
		buchungsbelegRepository.save(beleg);
		
		mvc.perform(get("/templates/accountrecord/" + beleg.getId()))
		   .andExpect(jsonPath("$.pattern.sender").value("hallo"))
		   .andExpect(jsonPath("$.pattern.details").value("whatever you will"))
		   .andExpect(jsonPath("$.pattern.senderID").value("einreicherID"))
		   .andExpect(jsonPath("$.pattern.receiver").value("empfänger"))
		   .andExpect(jsonPath("$.pattern.mandat").value("mandat"))
		   .andExpect(jsonPath("$.pattern.referenceID").value("refernzID"))
		   .andExpect(jsonPath("$.value").value("200"))
		   .andExpect(jsonPath("$.start").value("2000-04-02"))
		   ;
	}
}
