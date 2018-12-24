package loc.balsen.kontospring.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import java.time.LocalDate;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import loc.balsen.kontospring.data.BuchungsBeleg;
import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.Zuordnung;
import loc.balsen.kontospring.testutil.TestContext;

@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@WebAppConfiguration
public class BelegControllerTest extends TestContext {

	@Autowired
	MockMvc mvc;
	
	@Test
	public void test() throws Exception {
		
		mvc.perform(get("/belege/unassigned"))
		   .andExpect(jsonPath("$.[*]", hasSize(0)));

		BuchungsBeleg beleg = createBeleg("beleg");
		
		mvc.perform(get("/belege/unassigned"))
		   .andExpect(jsonPath("$.[*]", hasSize(1)));

		createBeleg("beleg1");
		mvc.perform(get("/belege/unassigned"))
		   .andExpect(jsonPath("$.[*]", hasSize(2)));
		
		createZuordnung(beleg);
		mvc.perform(get("/belege/unassigned"))
		   .andExpect(jsonPath("$.[*]", hasSize(1)))
		   .andExpect(jsonPath("$.[0].details").value( "beleg1"));
}

	private void createZuordnung(BuchungsBeleg beleg) {
		Plan plan =  new Plan();
		planRepository.save(plan);
		Zuordnung zuordnung = new Zuordnung();
		zuordnung.setBuchungsbeleg(beleg);
		zuordnung.setPlan(plan);
		zuordnungRepository.save(zuordnung);
	}

	private BuchungsBeleg createBeleg(String description) {
		BuchungsBeleg result =  new BuchungsBeleg();
		result.setDetails(description);
		result.setWertstellung(LocalDate.now());
		buchungsbelegRepository.save(result);
		return result;
	}

}
