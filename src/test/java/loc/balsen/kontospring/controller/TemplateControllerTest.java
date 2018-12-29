package loc.balsen.kontospring.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.junit.Assert.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import loc.balsen.kontospring.data.BuchungsBeleg;
import loc.balsen.kontospring.data.Konto;
import loc.balsen.kontospring.data.Kontogruppe;
import loc.balsen.kontospring.data.Template;
import loc.balsen.kontospring.testutil.TestContext;

@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@WebAppConfiguration
public class TemplateControllerTest extends TestContext {

	static private String templatejson = "{  " + 
			"\"gueltigVon\": \"2018-12-03\", " +
			"\"gueltigBis\": \"2018-11-03\", " +
			"\"start\": \"2018-10-03\", " +
			"\"vardays\": 5, " +
			"\"anzahl\": 1," +
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
		   .andExpect(jsonPath("$.[0].shortdescription").value("Kurz"));
		
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
		
		Kontogruppe kontogruppe = new Kontogruppe();
		kontogruppeRepository.save(kontogruppe);
		
		Konto konto = new Konto();
		konto.setId(1);
		konto.setKontoGruppe(kontogruppe);
		kontoRepository.save(konto);
		
		mvc.perform(get("/templates/beleg/" + beleg.getId()))
		   .andExpect(jsonPath("$.pattern.sender").value("hallo"))
		   .andExpect(jsonPath("$.pattern.details").value("whatever you will"))
		   .andExpect(jsonPath("$.pattern.senderID").value("einreicherID"))
		   .andExpect(jsonPath("$.pattern.receiver").value("empfänger"))
		   .andExpect(jsonPath("$.pattern.mandat").value("mandat"))
		   .andExpect(jsonPath("$.pattern.referenceID").value("refernzID"))
		   .andExpect(jsonPath("$.wert").value("200"))
		   .andExpect(jsonPath("$.start").value("2000-04-02"))
		   ;
	}
}
