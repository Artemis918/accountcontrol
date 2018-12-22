package loc.balsen.kontospring.controller;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import loc.balsen.kontospring.Application;
import loc.balsen.kontospring.controller.CollectionsController;
import loc.balsen.kontospring.data.Konto;
import loc.balsen.kontospring.data.Kontogruppe;
import loc.balsen.kontospring.repositories.KontoGruppeRepository;
import loc.balsen.kontospring.repositories.KontoRepository;

@RunWith(SpringJUnit4ClassRunner.class)
@AutoConfigureMockMvc
@ContextConfiguration(classes = Application.class)
@TestPropertySource("classpath:/h2database.properties")
@WebAppConfiguration
public class CollectionsControllerTest {

	@Autowired
	private KontoGruppeRepository kontogruppeRepository;
	
	@Autowired
	private KontoRepository kontoRepository;

	@Autowired
	private MockMvc mvc;

	@Autowired
	private CollectionsController service;

	@Test
	public void testPlanart() throws Exception {
		mvc.perform(get("/collections/matchstyle"))
		   .andExpect(status().isOk())
		   .andExpect(jsonPath("$.[0].text", is("Genau")))
		   .andExpect(jsonPath("$.[3].value", is(3)));
	}

	@Test
	public void testRhytmus() throws Exception {
		mvc.perform(get("/collections/rythmus"))
		   .andExpect(status().isOk())
		   .andExpect(jsonPath("$.[3].text", is("Jahr")))
		   .andExpect(jsonPath("$.[0].value", is(0)));
	}
	
	@Test
	public void testKontoGroups() throws Exception {
		createKontoData();
		mvc.perform(get("/collections/kontogroups")
				   .contentType(MediaType.APPLICATION_JSON))
				   .andExpect(status().isOk())
				   .andExpect(jsonPath("$.[2].text", is("KontoG3")))
				   .andExpect(jsonPath("$.[0].value", is(1)))
				   .andExpect(jsonPath("$.[2].value", is(3)));
		
	}
	
	@Test
	public void testKontos() throws Exception {
		createKontoData();
		mvc.perform(get("/collections/konto/1")
				   .contentType(MediaType.APPLICATION_JSON))
				   .andExpect(status().isOk())
				   .andExpect(jsonPath("$[*]", hasSize(4)))
				   .andExpect(jsonPath("$.[0].text", is("k1shortDesc")))
				   .andExpect(jsonPath("$.[2].value", is(3)));

		mvc.perform(get("/collections/konto/2")
				   .contentType(MediaType.APPLICATION_JSON))
				   .andExpect(status().isOk())
				   .andExpect(jsonPath("$[*]", hasSize(1)))
				   .andExpect(jsonPath("$.[0].text", is("k5shortDesc")))
				   .andExpect(jsonPath("$.[0].value", is(5)));		
	}

	private void createKontoData() {
		Kontogruppe kg1 =  new Kontogruppe();
		Kontogruppe kg2 =  new Kontogruppe();
		Kontogruppe kg3 =  new Kontogruppe();
		kg1.setShortdescription("KontoG1");
		kg2.setShortdescription("KontoG2");
		kg3.setShortdescription("KontoG3");
		kontogruppeRepository.save(kg1);
		kontogruppeRepository.save(kg2);
		kontogruppeRepository.save(kg3);
		
		Konto k1 = new Konto();
		Konto k2 = new Konto();
		Konto k3 = new Konto();
		Konto k4 = new Konto();
		Konto k5 = new Konto();
		k1.setDescription("k1LangDesc");
		k1.setShortdescription("k1shortDesc");
		k2.setShortdescription("k2shortDesc");
		k3.setShortdescription("k3shortDesc");
		k4.setShortdescription("k4shortDesc");
		k5.setShortdescription("k5shortDesc");
		k1.setKontoGruppe(kg1);
		k2.setKontoGruppe(kg1);
		k3.setKontoGruppe(kg1);
		k4.setKontoGruppe(kg1);
		k5.setKontoGruppe(kg2);
		
		kontoRepository.save(k1);
		kontoRepository.save(k2);
		kontoRepository.save(k3);
		kontoRepository.save(k4);
		kontoRepository.save(k5);
	}

}
