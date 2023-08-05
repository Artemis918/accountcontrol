package loc.balsen.accountcontrol.dataservice;

import static org.junit.Assert.assertTrue;
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
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.web.WebAppConfiguration;
import loc.balsen.accountcontrol.data.Pattern;
import loc.balsen.accountcontrol.data.Template;
import loc.balsen.accountcontrol.repositories.TemplateRepository;
import loc.balsen.accountcontrol.testutil.TestContext;

@ExtendWith(SpringExtension.class)
@WebAppConfiguration
public class TemplateServiceTest extends TestContext {

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
  public void testSaveTemplate() {
    template = new Template(0, LocalDate.of(1999, 1, 3), null, LocalDate.of(2023, 10, 2), 5, 1,
        Template.TimeUnit.MONTH, "temp1Long", 0, 100, subCategory2,
        new Pattern("\"sender\": \"gulli2\""), "temp2Short", null, 0);

    templateService.saveTemplate(template);
    verify(planService, times(1)).createPlansfromTemplate(template);
    assertTrue(templateRepository.findById(template.getId()).isPresent());

    template1 = new Template(template);
    templateService.saveTemplate(template1);
    assertNotEquals(template.getId(), template1.getId());
    assertEquals(template.getValidFrom(), template1.getValidFrom());
    verify(planService, times(1)).createPlansfromTemplate(template1);
    verify(planService, times(1)).deactivatePlans(any(Template.class));


    Template template2 = new Template(template1);
    LocalDate lastDateUsed = LocalDate.of(1999, 3, 3);
    when(planService.getLastAssignedPlanOf(any(Template.class))).thenReturn(lastDateUsed);
    templateService.saveTemplate(template2);

    Template template1db = templateRepository.findById(template1.getId()).get();

    assertNotEquals(template1.getId(), template2.getId());
    assertEquals(template1db.getValidUntil().plusDays(1), template2.getValidFrom());
    assertEquals(lastDateUsed, template1db.getValidUntil());
    verify(planService, times(1)).createPlansfromTemplate(template2);
    verify(planService, times(2)).deactivatePlans(any(Template.class));

  }

  @Test
  public void testDeleteTemplate() {

    template = new Template(0, LocalDate.of(1999, 1, 3), null, LocalDate.of(1998, 10, 2), 5, 1,
        Template.TimeUnit.MONTH, "testerLong", 0, 100, subCategory2,
        new Pattern("\"sender\": \"gulli1\""), "testerShort", null, 0);

    templateRepository.save(template);

    template1 = new Template(template);

    templateService.deleteTemplate(template1);

    verify(planService, times(1)).detachPlans(template1);
    assertFalse(templateRepository.findById(template.getId()).isPresent());
  }

}
