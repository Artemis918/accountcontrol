package loc.balsen.kontospring.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import java.time.LocalDate;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import loc.balsen.kontospring.data.AccountRecord;
import loc.balsen.kontospring.data.Pattern;
import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.Zuordnung;
import loc.balsen.kontospring.testutil.TestContext;

@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@WebAppConfiguration
public class RecordControllerTest extends TestContext {

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
	public void test() throws Exception {
		int startSize = assignRecordRepository.findUnresolvedRecords().size();
		
		mvc.perform(get("/record/unassigned"))
		   .andExpect(jsonPath("$.[*]", hasSize(startSize)));

		AccountRecord record = createRecord("accountrecord");
		
		mvc.perform(get("/record/unassigned"))
		   .andExpect(jsonPath("$.[*]", hasSize(startSize+ 1)));

		createRecord("record1");
		mvc.perform(get("/record/unassigned"))
		   .andExpect(jsonPath("$.[*]", hasSize(startSize+ 2)));
		
		createZuordnung(record);
		mvc.perform(get("/record/unassigned"))
		   .andExpect(jsonPath("$.[*]", hasSize(startSize + 1)))
		   .andExpect(jsonPath("$.[" + startSize + "].details").value( "record1"));
}

	private void createZuordnung(AccountRecord record) {
		Plan plan =  new Plan();
		plan.setPattern(new Pattern("\"sender\": \"help\""));
		plan.setSubCategory(subCategory1);
		planRepository.save(plan);
		Zuordnung zuordnung = new Zuordnung();
		zuordnung.setAccountrecord(record);
		zuordnung.setPlan(plan);
		zuordnungRepository.save(zuordnung);
	}

	private AccountRecord createRecord(String description) {
		AccountRecord result =  new AccountRecord();
		result.setDetails(description);
		result.setWertstellung(LocalDate.now());
		assignRecordRepository.save(result);
		return result;
	}

}
