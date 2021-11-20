package loc.balsen.kontospring.dataservice;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import java.time.LocalDate;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.web.WebAppConfiguration;
import loc.balsen.kontospring.data.AccountRecord;
import loc.balsen.kontospring.data.Pattern;
import loc.balsen.kontospring.data.Template;
import loc.balsen.kontospring.repositories.AccountRecordRepository;
import loc.balsen.kontospring.repositories.AssignmentRepository;
import loc.balsen.kontospring.repositories.SubCategoryRepository;
import loc.balsen.kontospring.repositories.TemplateRepository;
import loc.balsen.kontospring.testutil.TestContext;

@ExtendWith(SpringExtension.class)
@WebAppConfiguration
public class TemplateServiceTest extends TestContext {

  @Autowired
  public AccountRecordRepository accountRecordRepository;

  @Autowired
  public AssignmentRepository assignmentRepository;

  @Autowired
  public SubCategoryRepository subCategoryRepository;

  @Mock
  public PlanService planService;

  @Autowired
  public TemplateRepository templateRepository;

  public TemplateService templateService;

  private AutoCloseable closeable;

  private Template template;
  private Template template1;


  @BeforeEach
  public void setUp() {
    createCategoryData();
    createTestData();
    closeable = MockitoAnnotations.openMocks(this);
    templateService = new TemplateService(planService, templateRepository, accountRecordRepository,
        subCategoryRepository);
  }

  @AfterEach
  public void teardown() throws Exception {
    closeable.close();
    clearRepos();
  }

  @Test
  public void testReplan() {
    template1.setValue(200);
    template1.setValidFrom(LocalDate.of(1999, 5, 1));
    when(planService.getLastPlanOf(any(Template.class))).thenReturn(LocalDate.of(1999, 4, 30));

    templateService.saveTemplate(template1);

    ArgumentCaptor<Template> tempcap = ArgumentCaptor.forClass(Template.class);
    verify(planService, times(1)).deactivatePlans(tempcap.capture());
    verify(planService, times(1)).createPlansfromTemplate(template1);

    Template templateOrig = templateRepository.findById(template.getId()).get();
    assertEquals(template.getId(), tempcap.getValue().getId());
    assertNotEquals(template1.getId(), template.getId());
    assertEquals(template1.getId(), templateOrig.getNext());

    assertEquals(template1.getValidFrom(), templateOrig.getValidUntil().plusDays(1));
  }

  @Disabled("dont know the reason anymore :-(")
  @Test
  public void testReplaceTemplate() {
    int oldid = template.getId();
    templateService.replaceTemplate(template1, template);
    assertEquals(template.getId(), template1.getNext());
    assertEquals(template.getValidFrom().minusDays(1), template1.getValidUntil());
    assertNotEquals(oldid, template.getId());
    verify(planService, times(1)).deactivatePlans(template1);
    verify(planService, times(1)).createPlansfromTemplate(template);
  }

  @Test
  public void testReplacePattern() {
    LocalDate testdate = LocalDate.of(1997, 5, 1);
    Pattern testPattern = new Pattern("{ \"sender\": \"hans02\" }");
    templateService.replacePattern(template, testdate, testPattern);
    assertEquals(testPattern, template.getPatternObject());
    verify(planService, times(1)).replacePattern(template, testdate, testPattern);
  }

  // @Test
  public void testEndTemplate() {
    template.setValidUntil(LocalDate.of(1999, 5, 1));
    templateService.saveTemplate(template);
    verify(planService, times(1)).deactivatePlans(template);
  }

  public void createTestData() {

    AccountRecord record = new AccountRecord();
    accountRecordRepository.save(record);

    template = new Template();
    template.setShortDescription("tester");
    template.setDescription("tester");
    template.setRepeatCount(1);
    template.setRepeatUnit(Template.TimeUnit.MONTH);
    template.setVariance(5);
    template.setValidFrom(LocalDate.of(1999, 1, 3));
    template.setStart(LocalDate.of(1998, 10, 2));
    template.setPattern(new Pattern("\"sender\": \"gulli1\""));
    template.setSubCategory(subCategory2);
    template.setValue(100);
    templateRepository.save(template);

    template1 = new Template();
    template1.setId(template.getId());
    template1.setShortDescription("tester");
    template1.setDescription("tester");
    template1.setRepeatCount(1);
    template1.setRepeatUnit(Template.TimeUnit.MONTH);
    template1.setVariance(5);
    template1.setValidFrom(LocalDate.of(1999, 1, 3));
    template1.setStart(LocalDate.of(1998, 10, 2));
    template1.setPattern(new Pattern("\"sender\": \"gulli1\""));
    template1.setSubCategory(subCategory2);
    template1.setValue(100);
  }

  @Test
  public void testDeleteTemplate() {
    templateService.deleteTemplate(template1);

    verify(planService, times(1)).detachPlans(template1);
    assertFalse(templateRepository.findById(template.getId()).isPresent());
  }

}
