package loc.balsen.accountcontrol.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import org.h2.tools.Server;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import loc.balsen.accountcontrol.data.AccountRecord;
import loc.balsen.accountcontrol.data.Assignment;
import loc.balsen.accountcontrol.data.Pattern;
import loc.balsen.accountcontrol.data.Plan;
import loc.balsen.accountcontrol.testutil.TestContext;

@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
@WebAppConfiguration
public class AccountRecordControllerTest extends TestContext {

  @Autowired
  MockMvc mvc;

  @BeforeEach
  public void setup() throws SQLException {
    Server webServer = Server.createWebServer("-web", "-webAllowOthers", "-webPort", "8083");
    webServer.start();
    createCategoryData();
  }

  @AfterEach
  public void teardown() {
    clearRepos();
  }

  @Test
  public void testLoadRecords() throws Exception {
    createRecord("testsecurity");
    int startSize = accountRecordRepository.findUnresolvedRecords().size();

    mvc.perform(get("/accountrecord/unassigned")).andExpect(jsonPath("$.[*]", hasSize(startSize)));

    AccountRecord record = createRecord("accountrecord");

    mvc.perform(get("/accountrecord/unassigned"))
        .andExpect(jsonPath("$.[*]", hasSize(startSize + 1)));

    createRecord("record1");
    mvc.perform(get("/accountrecord/unassigned"))
        .andExpect(jsonPath("$.[*]", hasSize(startSize + 2)));

    createAssignment(record);
    mvc.perform(get("/accountrecord/unassigned"))
        .andExpect(jsonPath("$.[*]", hasSize(startSize + 1)))
        .andExpect(jsonPath("$.[" + startSize + "].details").value("record1"));
  }

  private void createAssignment(AccountRecord record) {

    Plan plan = new Plan(0, null, null, null, null, 0, 1, new Pattern("\"sender\": \"help\""),
        "short", "description", null, subCategory1, null);
    planRepository.save(plan);

    Assignment assignment = new Assignment(10, plan, record);
    assignmentRepository.save(assignment);
  }

  private AccountRecord createRecord(String description) {
    LocalDate executed = LocalDate.now();
    ArrayList<String> detlist = new ArrayList<>();
    detlist.add(description);
    AccountRecord result = new AccountRecord(0, null, null, executed, null, "sender", "receiver", 0,
        detlist, "submitter", "mandate", "reference");
    accountRecordRepository.save(result);
    return result;
  }

}
