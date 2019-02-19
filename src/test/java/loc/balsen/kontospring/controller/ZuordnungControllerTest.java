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
import loc.balsen.kontospring.data.Konto;
import loc.balsen.kontospring.data.Pattern;
import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.Zuordnung;
import loc.balsen.kontospring.testutil.TestContext;

@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@WebAppConfiguration
public class ZuordnungControllerTest extends TestContext {

	@Autowired
	MockMvc mvc;

	@Before
	public void setup() {
		createKontoData();
	}
	
	@After
	public void teardown() {
		clearRepos();
	}

	@Test
	public void testAssign() throws Exception {

		LocalDate today = LocalDate.now();
		int month = today.getMonthValue();
		int year = today.getYear();

		createBeleg("test1 blabla");
		createBeleg("test2 blabla");
		createBeleg("test3 bleble");
		createBeleg("test4 bleble");
		createPlan("1", konto1);
		createPlan("2", konto2);
		createPlan("3", konto5);

		mvc.perform(get("/assign/all")).andExpect(status().isOk());
		assertEquals(3, zuordnungRepository.findAll().size());

		mvc.perform(get("/assign/getKontoGroup/" + year + "/" + month + "/" + kontogruppe1.getId()))
				.andExpect(status().isOk()).andExpect(jsonPath("$.[*]", hasSize(2)));

		mvc.perform(get("/assign/getKontoGroup/" + year + "/" + month + "/" + kontogruppe2.getId()))
				.andExpect(status().isOk()).andExpect(jsonPath("$.[*]", hasSize(1)));

		mvc.perform(get("/assign/getKontoGroup/" + year + "/" + month + "/" + kontogruppe3.getId()))
				.andExpect(status().isOk()).andExpect(jsonPath("$.[*]", hasSize(0)));

		mvc.perform(get("/assign/getKonto/" + year + "/" + month + "/" + konto1.getId())).andExpect(status().isOk())
				.andExpect(jsonPath("$.[*]", hasSize(1)));

	}

	@Test
	public void testAssignKonto() throws Exception {
		
		BuchungsBeleg beleg2 = createBeleg("test5 bleble");
		BuchungsBeleg beleg1 =createBeleg("test6 bleble");
		
		String json = "{ \"text\": \"helpme\""
				    + ", \"konto\": " + konto4.getId() 
				    + ", \"ids\": [ " + beleg1.getId() +"," +beleg2.getId() + " ] }";
		
		mvc.perform(post("/assign/tokonto")
				.content(json)
				.contentType(MediaType.APPLICATION_JSON))
		        .andExpect(status().isOk());
		
		List<Zuordnung> assignList = zuordnungRepository.findByShortdescription("helpme");
		assertEquals(2, assignList.size());
	}
	
	private BuchungsBeleg createBeleg(String description) {
		BuchungsBeleg result = new BuchungsBeleg();
		result.setDetails(description);
		result.setWertstellung(LocalDate.now());
		result.setBeleg(LocalDate.now());
		buchungsbelegRepository.save(result);
		return result;
	}

	private Plan createPlan(String detailmatch, Konto konto) {
		Plan plan = new Plan();
		plan.setDescription("short: " + detailmatch);
		plan.setStartDate(LocalDate.now().minusDays(2));
		plan.setPlanDate(LocalDate.now());
		plan.setEndDate(LocalDate.now().plusDays(2));
		plan.setKonto(konto);
		plan.setPattern(new Pattern("{\"details\": \"" + detailmatch + "\"}"));
		planRepository.save(plan);
		return plan;
	}
}
