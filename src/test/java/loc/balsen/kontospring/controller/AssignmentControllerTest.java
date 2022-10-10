package loc.balsen.kontospring.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.junit.Assert.assertSame;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import com.google.gson.Gson;
import loc.balsen.kontospring.data.AccountRecord;
import loc.balsen.kontospring.data.Assignment;
import loc.balsen.kontospring.data.Pattern;
import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.Plan.MatchStyle;
import loc.balsen.kontospring.data.SubCategory;
import loc.balsen.kontospring.data.Template;
import loc.balsen.kontospring.data.Template.TimeUnit;
import loc.balsen.kontospring.dataservice.AssignmentService;
import loc.balsen.kontospring.dataservice.TemplateService;
import loc.balsen.kontospring.dto.TemplateDTO;
import loc.balsen.kontospring.repositories.AssignmentRepository;
import loc.balsen.kontospring.testutil.TestContext;

@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
@WebAppConfiguration
public class AssignmentControllerTest extends TestContext {

  @Autowired
  MockMvc mvc;

  @Mock
  private AssignmentService mockAssignmentService;

  @Mock
  private TemplateService mockTemplateService;

  @Mock
  private AssignmentRepository mockAssignmentRepository;

  @Captor
  private ArgumentCaptor<List<AccountRecord>> accountrecordcaptor;

  @Captor
  private ArgumentCaptor<Template> templatecaptor;

  private AutoCloseable closeable;

  @BeforeEach
  public void setup() {
    createCategoryData();
    closeable = MockitoAnnotations.openMocks(this);
  }

  @AfterEach
  public void teardown() throws Exception {
    clearRepos();
    closeable.close();
  }

  @Test
  public void testCount() throws Exception {
    Gson gson = new Gson();

    AccountRecord record =
        new AccountRecord(0, null, null, null, null, null, null, 0, null, null, null, "testrec");
    accountRecordRepository.save(record);

    Assignment assignment = new Assignment(null, null, subCategory1, record, null);

    List<Integer> list = new ArrayList<>();
    list.add(Integer.valueOf(subCategory1.getId()));

    assignmentRepository.save(assignment);
    mvc.perform(MockMvcRequestBuilders.post("/assign/countsubcategory")
        .contentType(MediaType.APPLICATION_JSON).content(gson.toJson(list)))
        .andExpect(status().isOk()).andExpect(content().string("1"));

    list.add(Integer.valueOf(subCategory2.getId()));
    mvc.perform(post("/assign/countsubcategory").contentType(MediaType.APPLICATION_JSON)
        .content(gson.toJson(list))).andExpect(status().isOk()).andExpect(content().string("1"));
  }

  @Test
  public void testReplan() {
    AccountRecord record =
        new AccountRecord(0, null, null, null, null, null, null, 0, null, null, null, null);
    Template template = new Template(100, null, null, null, 0, 0, null, "MyTemplate", 0, 0, null,
        null, null, null, 0);
    Plan plan = new Plan(0, null, null, null, null, 0, 0, null, null, null, null, null, null);
    Plan plan_with_template =
        new Plan(0, null, null, null, null, 0, 0, null, null, null, null, null, template);

    Assignment assignment = new Assignment(1200, null, null, false, null, record, 0, null);
    Assignment assignment1 = new Assignment(1201, null, null, false, plan, record, 0, null);
    Assignment assignment2 =
        new Assignment(1202, null, null, false, plan_with_template, record, 0, null);

    when(mockAssignmentRepository.findById(Integer.valueOf(100)))
        .thenReturn(Optional.of(assignment));
    when(mockAssignmentRepository.findById(Integer.valueOf(101)))
        .thenReturn(Optional.of(assignment1));
    when(mockAssignmentRepository.findById(Integer.valueOf(102)))
        .thenReturn(Optional.of(assignment2));

    AssignmentController controller = new AssignmentController(null, mockAssignmentRepository,
        mockAssignmentService, mockTemplateService, null, null);

    // do nothing
    controller.setNewValue(100);
    verify(mockAssignmentRepository, times(0)).delete(assignment);

    controller.setNewValue(101);
    verify(mockAssignmentRepository, times(0)).delete(assignment1);

    controller.setNewValue(102);
    verify(mockAssignmentRepository, times(1)).delete(assignment2);
    verify(mockTemplateService, times(1)).saveTemplate(templatecaptor.capture());
    assertEquals("MyTemplate", templatecaptor.getValue().getDescription());

    verify(mockAssignmentService, times(1)).assign(accountrecordcaptor.capture());
    assertSame(record, accountrecordcaptor.getValue().get(0));

  }

  @Test
  public void testGetCategory() throws Exception {

    LocalDate today = LocalDate.now();
    int month = today.getMonthValue();
    int year = today.getYear();

    createRecord("test1 blabla", LocalDate.now());
    createRecord("test2 blabla", LocalDate.now());
    createRecord("test3 bleble", LocalDate.now());
    createRecord("test4 bleble", LocalDate.now());
    createPlan("1", subCategory1, null);
    createPlan("2", subCategory2, null);
    createPlan("3", subCategory5, null);

    mvc.perform(get("/assign/all")).andExpect(MockMvcResultMatchers.status().isOk());
    assertEquals(3, assignmentRepository.findAll().size());

    mvc.perform(get("/assign/getcategory/" + year + "/" + month + "/" + category1.getId()))
        .andExpect(status().isOk()).andExpect(jsonPath("$.[*]", hasSize(2)));

    mvc.perform(get("/assign/getcategory/" + year + "/" + month + "/" + category2.getId()))
        .andExpect(status().isOk()).andExpect(jsonPath("$.[*]", hasSize(1)));

    mvc.perform(get("/assign/getcategory/" + year + "/" + month + "/" + category3.getId()))
        .andExpect(status().isOk()).andExpect(jsonPath("$.[*]", hasSize(0)));

    mvc.perform(get("/assign/getsubcategory/" + year + "/" + month + "/" + subCategory1.getId()))
        .andExpect(status().isOk()).andExpect(jsonPath("$.[*]", hasSize(1)));

  }


  @Test
  public void testAssignSubCategory() throws Exception {

    AccountRecord record2 = createRecord("test5 bleble", LocalDate.now());
    AccountRecord record1 = createRecord("test6 bleble", LocalDate.now());

    String json = "{ \"text\": \"helpme\"" + ", \"subcategory\": " + subCategory4.getId()
        + ", \"ids\": [ " + record1.getId() + "," + record2.getId() + " ] }";

    mvc.perform(post("/assign/tosubcategory").content(json).contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk());

    List<Assignment> assignList = assignmentRepository.findByShortDescription("helpme");
    assertEquals(2, assignList.size());
  }


  @Test
  public void testAnalyze() {

    AssignmentController controller = new AssignmentController(subCategoryRepository, null, null,
        null, accountRecordRepository, planRepository);

    LocalDate templatedate = LocalDate.of(1977, 1, 2);
    Template template = new Template(0, null, null, templatedate, 0, 0, TimeUnit.MONTH, null, 0, 0,
        subCategory1, new Pattern(), null, MatchStyle.EXACT, 0);
    templateRepository.save(template);
    int templateId = template.getId();

    Plan plan = createPlan("123", subCategory1, null);
    Plan plan_with_template = createPlan("123", subCategory1, template);

    AccountRecord rec = createRecord("abc", LocalDate.now());
    TemplateDTO dto = controller.analyzePlan(rec.getId(), plan.getId());
    assertEquals("", dto.getAdditional());

    rec = createRecord("abc", LocalDate.now());
    dto = controller.analyzePlan(rec.getId(), plan_with_template.getId());
    assertEquals(templateId, dto.getId());
    assertEquals("10", dto.getAdditional());
    assertNotEquals(templatedate, dto.getStart());

    rec = createRecord("abc", LocalDate.now().minusDays(4));
    accountRecordRepository.save(rec);
    dto = controller.analyzePlan(rec.getId(), plan_with_template.getId());
    assertEquals(templateId, dto.getId());
    assertEquals("11", dto.getAdditional());

    rec = createRecord("a123b", LocalDate.now());
    dto = controller.analyzePlan(rec.getId(), plan_with_template.getId());
    assertEquals(templateId, dto.getId());
    assertEquals("00", dto.getAdditional());

    rec = createRecord("a123b", LocalDate.now().minusDays(3));
    accountRecordRepository.save(rec);
    dto = controller.analyzePlan(rec.getId(), plan_with_template.getId());
    assertEquals(templateId, dto.getId());
    assertEquals("01", dto.getAdditional());
  }

  private AccountRecord createRecord(String description, LocalDate executed) {
    List<String> detlist = new ArrayList<>();
    detlist.add(description);
    AccountRecord result = new AccountRecord(0, null, LocalDate.now(), executed, null, null, null,
        0, detlist, null, null, null);
    accountRecordRepository.save(result);
    return result;
  }

  private Plan createPlan(String detailmatch, SubCategory subCategory, Template template) {
    Plan plan = new Plan(0, null, LocalDate.now().minusDays(2), LocalDate.now(),
        LocalDate.now().plusDays(2), 0, 0, new Pattern("{\"details\": \"" + detailmatch + "\"}"),
        null, "long: " + detailmatch, null, subCategory, template);
    plan.setPattern(new Pattern("{\"details\": \"" + detailmatch + "\"}"));
    planRepository.save(plan);
    return plan;
  }
}
