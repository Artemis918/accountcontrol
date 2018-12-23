package loc.balsen.kontospring.controller;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.Matchers.hasSize;
import static org.junit.Assert.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import loc.balsen.kontospring.data.Konto;
import loc.balsen.kontospring.data.Kontogruppe;
import loc.balsen.kontospring.data.Template;
import loc.balsen.kontospring.testutil.TestContext;

@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@WebAppConfiguration
public class TemplateControllerTest extends TestContext {

	static private String templatejson = "{  " + 
			"\"gueltigVon\": \"2018-12-03T11:00:00.000Z\", " +
			"\"gueltigBis\": \"2018-11-03T11:00:00.000Z\", " +
			"\"start\": \"2018-10-03T11:00:00.000Z\", " +
			"\"vardays\": 5, " +
			"\"anzahlRythmus\": 1," +
			"\"rythmus\": 2, " +
			"\"konto\": 2, " +
			"\"kontogroup\": 1, "+
			"\"description\": \"Beschreibung\", " +
			"\"shortdescription\": \"Kurz\", " +
			"\"position\": 5, " +
			"\"wert\": 100, " +
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

	@Test
	public void testSaveAndList() throws Exception {
		createKontoData();
		mvc.perform(post("/templates/save").content(templatejson).contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk());
		
		List<Template> templates =templateRepository.findAll();
		assertEquals(1,templates.size());
		Template template = templates.get(0);
		assertEquals(100, template.getWert());
		assertEquals(2, template.getKonto().getId());
		
		mvc.perform(get("/templates/list"))
		   .andExpect(jsonPath("$.[*]", hasSize(1)))
		   .andExpect(jsonPath("$.[0].shortdescription", is("Kurz")));
		
	}
	
	private void createKontoData() {
		Kontogruppe kg1 =  new Kontogruppe();
		kg1.setShortdescription("KontoG1");
		kontogruppeRepository.save(kg1);
		
		Konto k1 = new Konto();
		Konto k2 = new Konto();
		k1.setShortdescription("k1shortDesc");
		k2.setShortdescription("k2shortDesc");
		k1.setKontoGruppe(kg1);
		k2.setKontoGruppe(kg1);
		
		kontoRepository.save(k1);
		kontoRepository.save(k2);
	}

}
