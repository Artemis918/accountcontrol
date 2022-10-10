package loc.balsen.accountcontrol.dataservice;

import static org.junit.Assert.assertNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.web.WebAppConfiguration;
import loc.balsen.accountcontrol.data.Assignment;
import loc.balsen.accountcontrol.data.Pattern;
import loc.balsen.accountcontrol.data.Plan;
import loc.balsen.accountcontrol.data.Template;
import loc.balsen.accountcontrol.data.Template.TimeUnit;
import loc.balsen.accountcontrol.repositories.AssignmentRepository;
import loc.balsen.accountcontrol.repositories.PlanRepository;
import loc.balsen.accountcontrol.repositories.TemplateRepository;
import loc.balsen.accountcontrol.testutil.TestContext;

@ExtendWith(SpringExtension.class)
@WebAppConfiguration
public class PlanServiceTest extends TestContext {

  @Autowired
  private PlanService planService;

  @Autowired
  private AssignmentRepository assignmentRepository;

  private PlanService planService_mocked;

  @Mock
  private PlanRepository mockPlanRepository;

  @Mock
  private TemplateRepository mockTemplateRepository;

  private AutoCloseable closeable;

  private final String senderjson = "{\"sender\": \"gulli0\"}";

  @BeforeEach
  public void setup() {
    closeable = MockitoAnnotations.openMocks(this);
    createCategoryData();
    createTestData();
    planService_mocked = new PlanService(mockPlanRepository, mockTemplateRepository);
  }

  @AfterEach
  public void teardown() throws Exception {
    clearRepos();
    closeable.close();
  }

  private Plan latestPlan;
  private Template template;

  @Test
  public void testSimpleCreatePlansfromTemplate() {

    latestPlan = createPlan(1997, 5, 14);
    planRepository.save(latestPlan);
    planService.createPlansfromTemplate(template);
    List<Plan> plans = planRepository.findAll();
    assertEquals(1, plans.size());

    latestPlan = createPlan(1999, 1, 1);
    planRepository.save(latestPlan);
    planService.createPlansfromTemplate(template);
    plans = planRepository.findAll();
    assertEquals(2, plans.size());

    latestPlan = createPlan(1999, 1, 31);
    planRepository.save(latestPlan);
    planService.createPlansfromTemplate(template);
    plans = planRepository.findAll();
    assertEquals(3, plans.size());

    latestPlan = createPlan(1999, 2, 1);
    planRepository.save(latestPlan);
    planService.createPlansfromTemplate(template);
    plans = planRepository.findAll();
    assertEquals(5, plans.size());

    Plan createdplan = plans.stream().max((Plan a, Plan b) -> {
      return a.getId() > b.getId() ? 1 : -1;
    }).orElseThrow();
    assertEquals("testerShort", createdplan.getShortDescription());
    assertEquals(LocalDate.of(1999, 2, 2), createdplan.getPlanDate());
    assertEquals(LocalDate.of(1999, 1, 28), createdplan.getStartDate());
    assertEquals(LocalDate.of(1999, 2, 7), createdplan.getEndDate());
    assertEquals("testerLong", createdplan.getTemplate().getDescription());
    assertEquals(LocalDate.now(), createdplan.getCreationDate());

    latestPlan = createPlan(1999, 4, 30);
    planRepository.save(latestPlan);
    planService.createPlansfromTemplate(template);
    plans = planRepository.findAll();
    assertEquals(9, plans.size()); // 3 new plans, 1 by the former call, 5 latestPlan
  }


  @Test
  public void testValidPeriod() {
    template.setValidUntil(LocalDate.of(1999, 6, 2));
    templateRepository.save(template);
    planRepository.save(createPlan(1999, 8, 30));

    planService.createPlansfromTemplate(template);
    List<Plan> plans = planRepository.findAll();
    assertEquals(6, plans.size());
  }

  @Test
  public void testLastPlanOfTemplate() {

    latestPlan = createPlan(1999, 8, 30);
    planRepository.save(latestPlan);
    template.setValidUntil(null);
    templateRepository.save(template);
    planService.createPlansfromTemplatesUntil(05, 2000);

    List<Plan> plans = planRepository.findByTemplate(template);
    plans.sort(Comparator.comparing(Plan::getId));

    LocalDate last = planService.getLastPlanOf(template);
    assertNull(last);

    LocalDate plandate = createAssignment(plans.get(1));
    last = planService.getLastPlanOf(template);
    assertEquals(plandate, last);

    plandate = createAssignment(plans.get(2));
    last = planService.getLastPlanOf(template);
    assertEquals(plandate, last);

    plandate = createAssignment(plans.get(4));
    last = planService.getLastPlanOf(template);
    assertEquals(plandate, last);

    createAssignment(plans.get(3));
    last = planService.getLastPlanOf(template);
    assertEquals(plandate, last);

  }

  private LocalDate createAssignment(Plan plan) {
    Assignment assignment = new Assignment(0, plan, null);
    assignmentRepository.save(assignment);
    return plan.getPlanDate();
  }

  @Test
  public void testCreateUntil() {

    planRepository.save(createPlan(1999, 8, 30));

    template.setValidUntil(null);
    templateRepository.save(template);

    planService.createPlansfromTemplatesUntil(8, 1999);
    List<Plan> plans = planRepository.findAll();
    assertEquals(1, plans.size());

    planService.createPlansfromTemplatesUntil(9, 1999);
    plans = planRepository.findAll();
    assertEquals(3, plans.size());

    planService.createPlansfromTemplatesUntil(12, 1999);
    plans = planRepository.findAll();
    assertEquals(9, plans.size());
  }

  @Test
  public void testDeactivatePlans() {

    planService.createPlansfromTemplatesUntil(9, 1999);

    // deactivate plans
    template.setValidUntil(LocalDate.of(1999, 9, 15));
    templateRepository.save(template);
    planService.deactivatePlans(template);
    List<Plan> plans = planRepository.findAll();
    long deactivated = plans.stream().filter((p) -> {
      return p.getDeactivateDate() != null;
    }).count();
    assertEquals(0, deactivated);

    template.setValidUntil(LocalDate.of(1999, 9, 2));
    templateRepository.save(template);
    planService.deactivatePlans(template);
    plans = planRepository.findAll();
    deactivated = plans.stream().filter((p) -> {
      return p.getDeactivateDate() != null;
    }).count();
    assertEquals(0, deactivated);

    template.setValidUntil(LocalDate.of(1999, 9, 1));
    templateRepository.save(template);
    planService.deactivatePlans(template);
    plans = planRepository.findAll();
    deactivated = plans.stream().filter((p) -> {
      return p.getDeactivateDate() != null;
    }).count();
    assertEquals(1, deactivated);

    template.setValidUntil(LocalDate.of(1999, 7, 1));
    templateRepository.save(template);
    planService.deactivatePlans(template);
    plans = planRepository.findAll();
    deactivated = plans.stream().filter((p) -> {
      return p.getDeactivateDate() != null;
    }).count();
    assertEquals(3, deactivated);

  }

  @Test
  public void testDetachPlans() {
    Template tempdel = new Template();
    tempdel.setId(3);

    List<Plan> plans = new ArrayList<Plan>();
    for (int i = 0; i < 10; i++) {
      Plan plan = new Plan(i, null, null, null, null, 0, 0, null, null, null, null, null, tempdel);
      plans.add(plan);
    }

    when(mockPlanRepository.findByTemplate(tempdel)).thenReturn(plans);

    planService_mocked.detachPlans(tempdel);

    for (int i = 0; i < 10; i++) {
      Plan plan = plans.get(i);
      verify(mockPlanRepository, times(1)).save(plan);
      assertEquals(null, plan.getTemplate());
    }
  }


  @Test
  public void testReplacePattern() {
    String senderjson = "{\"sender\": \"gulli0\"}";
    List<Plan> plans = new ArrayList<>();
    Plan plan1 = new Plan(1, null, null, LocalDate.of(1997, 5, 14), null, 0, 0,
        new Pattern(senderjson), null, null, null, null, null);
    plan1.setPattern(new Pattern(senderjson));
    plans.add(plan1);

    Plan plan2 = new Plan(2, null, null, LocalDate.of(1997, 6, 14), null, 0, 0,
        new Pattern(senderjson), null, null, null, null, null);
    plans.add(plan2);

    Plan plan3 = new Plan(3, null, null, LocalDate.of(1997, 7, 14), null, 0, 0,
        new Pattern(senderjson), null, null, null, null, null);
    plans.add(plan3);

    when(mockPlanRepository.findByTemplate(template)).thenReturn(plans);

    planService_mocked.replacePattern(template, LocalDate.of(1997, 6, 14),
        new Pattern("{\"sender\": \"someone\"}"));

    verify(mockPlanRepository, times(0)).save(plan1);
    verify(mockPlanRepository, times(1)).save(plan2);
    verify(mockPlanRepository, times(1)).save(plan3);

    assertEquals("gulli0", plan1.getPatternObject().getSender());
    assertEquals("someone", plan2.getPatternObject().getSender());
    assertEquals("someone", plan3.getPatternObject().getSender());

  }


  private Plan createPlan(int year, int month, int day) {
    return new Plan(0, null, null, LocalDate.of(year, month, day), null, 0, 0,
        new Pattern(senderjson), null, "templatetest", null, subCategory1, null);
  }

  private void createTestData() {

    template = new Template(0, LocalDate.of(1999, 1, 3), null, LocalDate.of(1998, 10, 2), 5, 1,
        TimeUnit.MONTH, "testerLong", 0, 0, subCategory2, new Pattern(senderjson), "testerShort",
        null, 0);
    templateRepository.save(template);

    Template template2 = new Template(0, LocalDate.of(1999, 1, 3), null, LocalDate.of(1998, 10, 2),
        5, 1, TimeUnit.MONTH, "tester2Short", 0, 0, subCategory5,
        new Pattern("\"sender\": \"gulli2\""), "tester2Short", null, 0);
    templateRepository.save(template2);
  }
}
