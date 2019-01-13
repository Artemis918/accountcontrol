package loc.balsen.kontospring.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.junit.Assert.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import loc.balsen.kontospring.data.BuchungsBeleg;
import loc.balsen.kontospring.data.Konto;
import loc.balsen.kontospring.data.Pattern;
import loc.balsen.kontospring.data.Plan;
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
	
	@Test
	public void testAssign() throws Exception {
		
		LocalDate today = LocalDate.now();
		int month = today.getMonthValue();
		int year = today.getYear();
		
		BuchungsBeleg beleg1 = createBeleg("test1 blabla");
		BuchungsBeleg beleg2 = createBeleg("test2 blabla");
		BuchungsBeleg beleg3 = createBeleg("test3 bleble");
		BuchungsBeleg beleg4 = createBeleg("test4 bleble");
		Plan plan1= createPlan("1",konto1);
		Plan plan2= createPlan("2",konto2);
		Plan plan3= createPlan("3",konto5);
		
		int zlen = zuordnungRepository.findAll().size();
		mvc.perform(get("/assign/all")).andExpect(status().isOk());
		assertEquals(zlen+3,zuordnungRepository.findAll().size());
		
		mvc.perform(get("/assign/getKontoGroup/" + year + "/" + month + "/" + kontogruppe1.getId()))
		   .andExpect(status().isOk())
		   .andExpect(jsonPath("$.[*]", hasSize(2)));

		mvc.perform(get("/assign/getKontoGroup/" + year + "/" + month + "/" + kontogruppe2.getId()))
		   .andExpect(status().isOk())
		   .andExpect(jsonPath("$.[*]", hasSize(1)));

		mvc.perform(get("/assign/getKontoGroup/" + year + "/" + month + "/" + kontogruppe3.getId()))
		   .andExpect(status().isOk())
		   .andExpect(jsonPath("$.[*]", hasSize(0)));

		mvc.perform(get("/assign/getKonto/" + year + "/" + month + "/" + konto1.getId()))
		   .andExpect(status().isOk())
		   .andExpect(jsonPath("$.[*]", hasSize(1)));

		}

	
	
	private BuchungsBeleg createBeleg(String description) {
		BuchungsBeleg result =  new BuchungsBeleg();
		result.setDetails(description);
		result.setWertstellung(LocalDate.now());
		result.setBeleg(LocalDate.now());
		buchungsbelegRepository.save(result);
		return result;
	}
	
	private Plan createPlan(String detailmatch,Konto konto) {
		Plan plan = new Plan();
		plan.setDescription("short: " + detailmatch);
		plan.setStartDate(LocalDate.now().minusDays(2));
		plan.setEndDate(LocalDate.now().plusDays(2));
		plan.setKonto(konto);
		plan.setPattern(new Pattern("{\"details\": \"" + detailmatch +"\"}"));
		planRepository.save(plan);
		return plan;
	}
}
