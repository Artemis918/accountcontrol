package loc.balsen.kontospring.dataservice;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
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

    planlist.add(createPlan(15, LocalDate.of(2018, 12, 3)));
    planlist.add(createPlan(10, LocalDate.of(2018, 12, 3)));
    planlist.add(createPlan(-5, LocalDate.of(2019, 2, 19)));
    planlist.add(createPlan(-24, LocalDate.of(2019, 2, 28)));
    planlist.add(createPlan(12, LocalDate.of(2019, 3, 13)));

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

  private Plan createPlan(int value, LocalDate plandate) {
    return new Plan(0, null, null, plandate, null, 0, value, null, null, null, null, null, null);
  }

  private AccountRecord createRecord(int year, int month, int day) {
    return new AccountRecord(0, null, null, LocalDate.of(year, month, day), null, null, null, 0,
        null, null, null, null);
  }

  @Test
  public void testGetCummulatedAssigns() {

    List<Assignment> zgeplantlist = new ArrayList<>();
    List<Assignment> zungeplantlist = new ArrayList<>();

    zungeplantlist
        .add(new Assignment(0, null, null, false, null, createRecord(2018, 12, 1), 100, null));
    zgeplantlist.add(
        new Assignment(110, createPlan(0, LocalDate.of(2018, 12, 3)), createRecord(2019, 1, 4)));
    zungeplantlist
        .add(new Assignment(0, null, null, false, null, createRecord(2019, 2, 2), -2, null));
    zungeplantlist
        .add(new Assignment(0, null, null, false, null, createRecord(2019, 2, 28), -12, null));
    zgeplantlist
        .add(new Assignment(17, createPlan(0, LocalDate.of(2019, 3, 1)), createRecord(2019, 1, 1)));


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
