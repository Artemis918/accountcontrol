package loc.balsen.kontospring.controller;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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

import loc.balsen.kontospring.testutil.TestContext;

@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@WebAppConfiguration
public class CollectionsControllerTest extends TestContext {

	@Autowired
	private MockMvc mvc;

	@Before
	public void setup() {
		createKontoData();
	}

	@After
	public void teardown() {
		clearRepos();
	}
	
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
		mvc.perform(get("/collections/kontogroups")
				   .contentType(MediaType.APPLICATION_JSON))
				   .andExpect(status().isOk())
				   .andExpect(jsonPath("$.[2].text", is("KontoG3")))
				   .andExpect(jsonPath("$.[0].value", is(1)))
				   .andExpect(jsonPath("$.[2].value", is(3)));
		
	}
	
	@Test
	public void testKontos() throws Exception {
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

}
