package loc.balsen.kontospring.controller;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.Matchers.hasSize;
import static org.junit.Assert.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import loc.balsen.kontospring.data.BuchungsBeleg;
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

		BuchungsBeleg beleg = createBelege();
		createZuordnung(beleg);
		
		mvc.perform(get("/belege/unassigned"))
		   .andExpect(jsonPath("$.[*]", hasSize(0)));
		
		BuchungsBeleg beleg1 = createBelege();
		mvc.perform(get("/belege/unassigned"))
		   .andExpect(jsonPath("$.[*]", hasSize(0)));
}

	private void createZuordnung(BuchungsBeleg beleg) {
		// TODO Auto-generated method stub
		
	}

	private BuchungsBeleg createBelege() {
		// TODO Auto-generated method stub
		return null;
	}

}
