package loc.balsen.accountcontrol.dataservice;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
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
import loc.balsen.accountcontrol.data.AccountRecord;
import loc.balsen.accountcontrol.data.Pattern;
import loc.balsen.accountcontrol.data.Template;
import loc.balsen.accountcontrol.repositories.AccountRecordRepository;
import loc.balsen.accountcontrol.repositories.AssignmentRepository;
import loc.balsen.accountcontrol.repositories.SubCategoryRepository;
import loc.balsen.accountcontrol.repositories.TemplateRepository;
import loc.balsen.accountcontrol.testutil.TestContext;

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
  public void testDeleteTemplate() {

    AccountRecord record = new AccountRecord();
    accountRecordRepository.save(record);

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
