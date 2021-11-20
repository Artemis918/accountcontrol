package loc.balsen.kontospring.dataservice;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.web.WebAppConfiguration;

import loc.balsen.kontospring.data.AccountRecord;
import loc.balsen.kontospring.data.Assignment;
import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.repositories.AssignmentRepository;
import loc.balsen.kontospring.repositories.PlanRepository;
import loc.balsen.kontospring.testutil.TestContext;

@ExtendWith(SpringExtension.class)
@WebAppConfiguration
public class StatsServiceTest extends TestContext {

  @Mock
  private PlanRepository planRepository;

  @Mock
  private AssignmentRepository assignmentRepository;

  private StatsService statsService;

  @BeforeEach
  public void setUp() throws Exception {
    createCategoryData();
    statsService = new StatsService(assignmentRepository, planRepository);
  }

  @AfterEach
  public void tearDown() throws Exception {
    clearRepos();
  }

  @Test
  public void testGetCummulatedPlans() {

    List<Plan> planlist = new ArrayList<>();

    Plan plan1 = new Plan();
    plan1.setPlanDate(LocalDate.of(2018, 12, 3));
    plan1.setValue(15);
    planlist.add(plan1);

    Plan plan2 = new Plan();
    plan2.setPlanDate(LocalDate.of(2018, 12, 3));
    plan2.setValue(10);
    planlist.add(plan2);

    Plan plan3 = new Plan();
    plan3.setPlanDate(LocalDate.of(2019, 2, 19));
    plan3.setValue(-5);
    planlist.add(plan3);

    Plan plan4 = new Plan();
    plan4.setPlanDate(LocalDate.of(2019, 2, 28));
    plan4.setValue(-24);
    planlist.add(plan4);

    Plan plan5 = new Plan();
    plan5.setPlanDate(LocalDate.of(2019, 3, 13));
    plan5.setValue(12);
    planlist.add(plan5);

    when(planRepository.findByPlanDate(any(LocalDate.class), any(LocalDate.class)))
        .thenReturn(planlist);

    List<Integer> result =
        statsService.getMonthlyCumulatedPlan(LocalDate.of(2018, 10, 3), LocalDate.of(2019, 5, 3));

    assertEquals(8, result.size());
    assertEquals(0, result.get(0).intValue());
    assertEquals(0, result.get(1).intValue());
    assertEquals(25, result.get(2).intValue());
    assertEquals(25, result.get(3).intValue());
    assertEquals(-4, result.get(4).intValue());
    assertEquals(8, result.get(5).intValue());
    assertEquals(8, result.get(6).intValue());
    assertEquals(8, result.get(7).intValue());
  }

  @Test
  public void testGetCummulatedAssigns() {

    List<Assignment> zgeplantlist = new ArrayList<>();
    List<Assignment> zungeplantlist = new ArrayList<>();

    AccountRecord record1 = new AccountRecord();
    record1.setExecuted(LocalDate.of(2018, 12, 1));

    Assignment assignment1 = new Assignment();
    assignment1.setAccountrecord(record1);
    assignment1.setValue(100);
    zungeplantlist.add(assignment1);

    AccountRecord record2 = new AccountRecord();
    record2.setExecuted(LocalDate.of(2019, 1, 4));

    Plan plan2 = new Plan();
    plan2.setPlanDate(LocalDate.of(2018, 12, 3));

    Assignment assignment2 = new Assignment();
    assignment2.setAccountrecord(record2);
    assignment2.setValue(110);
    assignment2.setPlan(plan2);
    zgeplantlist.add(assignment2);

    AccountRecord record3 = new AccountRecord();
    record3.setExecuted(LocalDate.of(2019, 2, 2));

    Assignment assignment3 = new Assignment();
    assignment3.setAccountrecord(record3);
    assignment3.setValue(-2);
    zungeplantlist.add(assignment3);

    AccountRecord record4 = new AccountRecord();
    record4.setExecuted(LocalDate.of(2019, 2, 28));

    Assignment assignment4 = new Assignment();
    assignment4.setAccountrecord(record4);
    assignment4.setValue(-12);
    zungeplantlist.add(assignment4);

    AccountRecord record5 = new AccountRecord();
    record5.setExecuted(LocalDate.of(2019, 1, 1));

    Plan plan5 = new Plan();
    plan5.setPlanDate(LocalDate.of(2019, 3, 1));

    Assignment assignment5 = new Assignment();
    assignment5.setAccountrecord(record5);
    assignment5.setValue(17);
    assignment5.setPlan(plan5);
    zgeplantlist.add(assignment5);

    when(assignmentRepository.findAllPlannedByPeriod(any(LocalDate.class), any(LocalDate.class)))
        .thenReturn(zgeplantlist);
    when(assignmentRepository.findAllNotPlannedByPeriod(any(LocalDate.class), any(LocalDate.class)))
        .thenReturn(zungeplantlist);

    List<Integer> result = statsService.getMonthlyCumulatedAssigns(LocalDate.of(2018, 10, 3),
        LocalDate.of(2019, 5, 3));

    assertEquals(8, result.size());
    assertEquals(0, result.get(0).intValue());
    assertEquals(0, result.get(1).intValue());
    assertEquals(210, result.get(2).intValue());
    assertEquals(210, result.get(3).intValue());
    assertEquals(196, result.get(4).intValue());
    assertEquals(213, result.get(5).intValue());
    assertEquals(213, result.get(6).intValue());
    assertEquals(213, result.get(7).intValue());
  }


}
