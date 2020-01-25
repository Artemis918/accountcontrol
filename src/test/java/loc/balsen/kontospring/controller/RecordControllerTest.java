package loc.balsen.kontospring.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import java.sql.SQLException;
import java.time.LocalDate;

import org.h2.tools.Server;
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
import loc.balsen.kontospring.data.Assignment;
import loc.balsen.kontospring.testutil.TestContext;

@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@WebAppConfiguration
public class RecordControllerTest extends TestContext {

	@Autowired
	MockMvc mvc;
	
	@Before
	public void setup() throws SQLException {
		Server webServer = Server.createWebServer("-web", 
                "-webAllowOthers", "-webPort", "8082");
		webServer.start();
		createCategoryData();
	}
	
	@After
	public void teardown() {
		clearRepos();
	}
	
	@Test
	public void testLoadRecords() throws Exception {
		createRecord("testsecurity");
		int startSize = accountRecordRepository.findUnresolvedRecords().size();
		
		mvc.perform(get("/record/unassigned"))
		   .andExpect(jsonPath("$.[*]", hasSize(startSize)));

		AccountRecord record = createRecord("accountrecord");
		
		mvc.perform(get("/record/unassigned"))
		   .andExpect(jsonPath("$.[*]", hasSize(startSize+ 1)));

		createRecord("record1");
		mvc.perform(get("/record/unassigned"))
		   .andExpect(jsonPath("$.[*]", hasSize(startSize+ 2)));
		
		createAssignment(record);
		mvc.perform(get("/record/unassigned"))
		   .andExpect(jsonPath("$.[*]", hasSize(startSize + 1)))
		   .andExpect(jsonPath("$.[" + startSize + "].details").value( "record1"));
}

	private void createAssignment(AccountRecord record) {
		Plan plan =  new Plan();
		plan.setPattern(new Pattern("\"sender\": \"help\""));
		plan.setSubCategory(subCategory1);
		planRepository.save(plan);
		Assignment assignment = new Assignment();
		assignment.setAccountrecord(record);
		assignment.setPlan(plan);
		assignmentRepository.save(assignment);
	}

	private AccountRecord createRecord(String description) {
		AccountRecord result =  new AccountRecord();
		result.setDetails(description);
		result.setExecuted(LocalDate.now());
		accountRecordRepository.save(result);
		return result;
	}

}
