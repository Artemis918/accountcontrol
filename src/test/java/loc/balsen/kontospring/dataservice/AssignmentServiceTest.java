package loc.balsen.kontospring.dataservice;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import loc.balsen.kontospring.data.AccountRecord;
import loc.balsen.kontospring.data.Assignment;
import loc.balsen.kontospring.data.Pattern;
import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.Plan.MatchStyle;
import loc.balsen.kontospring.testutil.TestContext;

@ExtendWith(SpringExtension.class)
public class AssignmentServiceTest extends TestContext {

  @Autowired
  AssignmentService assignmentService;

  List<Plan> plans;

  @BeforeEach
  public void setup() {
    plans = new ArrayList<>();
    createCategoryData();
  }

  @AfterEach
  public void teardown() {
    clearRepos();
  }

  @Test
  public void test() {
    createPlans();

    // no match
    List<AccountRecord> buchungen1 = new ArrayList<>();
    buchungen1.add(createRecord("2018-01-02", "2345"));
    assignmentService.assign(buchungen1);
    List<Assignment> assignments = assignmentRepository.findAll();
    assertEquals(0, assignments.size());

    // one match
    List<AccountRecord> buchungen2 = new ArrayList<>();
    buchungen2.add(createRecord("2018-01-02", "1234"));
    assignmentService.assign(buchungen2);
    assignments = assignmentRepository.findAll(Sort.by("id"));
    assertEquals(1, assignments.size());
    Assignment assignment = assignments.get(0);
    assertEquals(buchungen2.get(0), assignment.getAccountrecord());
    assertEquals(plans.get(0), assignment.getPlan());
    assertEquals(0.7, assignment.getNaturalValue().doubleValue(), 0);

    // second call -> no additional matches
    assignmentService.assign(buchungen2);
    assignments = assignmentRepository.findAll(Sort.by("id"));
    assertEquals(1, assignments.size());

    // two matches
    List<AccountRecord> buchungen3 = new ArrayList<>();
    buchungen3.add(createRecord("2018-01-09", "3456"));
    assignmentService.assign(buchungen3);
    assignments = assignmentRepository.findAll(Sort.by("id"));
    assertEquals(3, assignments.size());
    assertEquals(0.25, assignments.get(1).getNaturalValue().doubleValue(), 0);
    assertEquals(0.45, assignments.get(2).getNaturalValue().doubleValue(), 0);

    // more than one
    List<AccountRecord> buchungen4 = new ArrayList<>();
    buchungen4.add(createRecord("2018-01-04", "2345"));
    buchungen4.add(createRecord("2018-01-25", "5678"));
    assignmentService.assign(buchungen4);
    assignments = assignmentRepository.findAll(Sort.by("id"));
    assertEquals(5, assignments.size());

    // pattern
    List<AccountRecord> buchungen5 = new ArrayList<>();
    buchungen5.add(createRecord("2018-01-04", "a98765"));
    assignmentService.assign(buchungen5);
    assignments = assignmentRepository.findAll(Sort.by("id"));
    assertEquals(6, assignments.size());
    assertNull(assignments.get(5).getPlan());
  }

  private AccountRecord createRecord(String date, String mandate) {
    AccountRecord record = new AccountRecord();
    record.setMandate(mandate);
    record.setExecuted(LocalDate.parse(date));
    record.setValue(70);
    accountRecordRepository.save(record);
    return record;
  }

  private void createPlans() {
    createplan("2018-01-01", "2018-01-07", "{\"mandate\": \"1234\"}");
    createplan("2018-01-04", "2018-01-12", "{\"mandate\": \"2345\"}");
    createplan("2018-01-08", "2018-01-16", "{\"mandate\": \"3456\"}");
    createplan("2018-01-08", "2018-01-19", "{\"mandate\": \"3456\"}");
    createplan("2018-01-17", "2018-01-25", "{\"mandate\": \"5678\"}");
    createplan("2018-01-17", "{\"mandate\": \"9876\"}");

  }

  private void createplan(String start, String end, String pattern) {
    Plan plan = new Plan();
    plan.setStartDate(LocalDate.parse(start));
    plan.setPlanDate(LocalDate.parse(start).plusDays(2));
    plan.setEndDate(LocalDate.parse(end));
    plan.setPattern(new Pattern(pattern));
    plan.setValue(25);
    plan.setSubCategory(subCategory1);
    planRepository.save(plan);
    plans.add(plan);
  }

  private void createplan(String start, String pattern) {
    Plan plan = new Plan();
    plan.setStartDate(LocalDate.parse(start));
    plan.setPlanDate(LocalDate.parse(start).plusDays(2));
    plan.setPattern(new Pattern(pattern));
    plan.setMatchStyle(MatchStyle.PATTERN);
    plan.setValue(25);
    plan.setSubCategory(subCategory2);
    planRepository.save(plan);
    plans.add(plan);
  }

}
