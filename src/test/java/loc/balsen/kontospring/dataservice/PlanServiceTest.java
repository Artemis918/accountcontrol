package loc.balsen.kontospring.dataservice;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
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
import loc.balsen.kontospring.data.Assignment;
import loc.balsen.kontospring.data.Pattern;
import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.Template;
import loc.balsen.kontospring.repositories.AssignmentRepository;
import loc.balsen.kontospring.repositories.PlanRepository;
import loc.balsen.kontospring.repositories.TemplateRepository;
import loc.balsen.kontospring.testutil.TestContext;

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

    planService.createPlansfromTemplate(template);
    List<Plan> plans = planRepository.findAll();
    assertEquals(1, plans.size());

    latestPlan.setPlanDate(LocalDate.of(1999, 1, 1));
    planRepository.save(latestPlan);
    planService.createPlansfromTemplate(template);
    plans = planRepository.findAll();
    assertEquals(1, plans.size());

    latestPlan.setPlanDate(LocalDate.of(1999, 1, 31));
    planRepository.save(latestPlan);
    planService.createPlansfromTemplate(template);
    plans = planRepository.findAll();
    assertEquals(1, plans.size());

    latestPlan.setPlanDate(LocalDate.of(1999, 2, 1));
    planRepository.save(latestPlan);
    planService.createPlansfromTemplate(template);
    plans = planRepository.findAll();
    assertEquals(2, plans.size());

    Plan createdplan = (plans.get(1).getId() > plans.get(0).getId()) ? plans.get(1) : plans.get(0);

    assertEquals("tester", createdplan.getShortDescription());
    assertEquals(LocalDate.of(1999, 2, 2), createdplan.getPlanDate());
    assertEquals(LocalDate.of(1999, 1, 28), createdplan.getStartDate());
    assertEquals(LocalDate.of(1999, 2, 7), createdplan.getEndDate());
    assertEquals(template, createdplan.getTemplate());
    assertEquals(LocalDate.now(), createdplan.getCreationDate());

    latestPlan.setPlanDate(LocalDate.of(1999, 4, 30));
    planRepository.save(latestPlan);
    planService.createPlansfromTemplate(template);
    plans = planRepository.findAll();
    assertEquals(5, plans.size()); // 3 new plans, 1 by the former call, 1 latestPlan
  }

  @Test
  public void testValidPeriod() {
    template.setValidUntil(LocalDate.of(1999, 6, 2));
    templateRepository.save(template);
    latestPlan.setPlanDate(LocalDate.of(1999, 8, 30));
    planRepository.save(latestPlan);

    planService.createPlansfromTemplate(template);
    List<Plan> plans = planRepository.findAll();
    assertEquals(6, plans.size());
  }

  @Test
  public void testLastPlanOfTemplate() {

    latestPlan.setPlanDate(LocalDate.of(1999, 8, 30));
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
    Assignment assignment = new Assignment();
    assignment.setPlan(plan);
    assignmentRepository.save(assignment);
    return plan.getPlanDate();
  }

  @Test
  public void testCreateUntil() {

    latestPlan.setPlanDate(LocalDate.of(1999, 8, 30));
    planRepository.save(latestPlan);

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
      Plan plan = new Plan();
      plan.setTemplate(tempdel);
      plan.setId(i);
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
    Plan plan1 = new Plan();
    plan1.setId(1);
    plan1.setPlanDate(LocalDate.of(1997, 5, 14));
    plan1.setPattern(new Pattern(senderjson));
    plans.add(plan1);

    Plan plan2 = new Plan();
    plan2.setId(2);
    plan2.setPlanDate(LocalDate.of(1997, 6, 14));
    plan2.setPattern(new Pattern(senderjson));
    plans.add(plan2);

    Plan plan3 = new Plan();
    plan3.setId(3);
    plan3.setPlanDate(LocalDate.of(1997, 7, 14));
    plan3.setPattern(new Pattern(senderjson));
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

  public void createTestData() {
    String senderjson = "{\"sender\": \"gulli0\"}";

    latestPlan = new Plan();
    latestPlan.setPlanDate(LocalDate.of(1997, 5, 14));
    latestPlan.setDescription("templatetest");
    latestPlan.setPattern(new Pattern(senderjson));
    latestPlan.setSubCategory(subCategory1);
    planRepository.save(latestPlan);

    template = new Template();
    template.setShortDescription("tester");
    template.setRepeatCount(1);
    template.setRepeatUnit(Template.TimeUnit.MONTH);
    template.setVariance(5);
    template.setValidFrom(LocalDate.of(1999, 1, 3));
    template.setStart(LocalDate.of(1998, 10, 2));
    template.setPattern(new Pattern(senderjson));
    template.setSubCategory(subCategory2);
    templateRepository.save(template);

    Template template2 = new Template();
    template2.setShortDescription("tester2");
    template2.setRepeatCount(1);
    template2.setRepeatUnit(Template.TimeUnit.MONTH);
    template2.setVariance(5);
    template2.setValidFrom(LocalDate.of(1999, 1, 3));
    template2.setStart(LocalDate.of(1998, 10, 2));
    template2.setPattern(new Pattern("\"sender\": \"gulli2\""));
    template2.setSubCategory(subCategory5);
    templateRepository.save(template2);
  }
}
