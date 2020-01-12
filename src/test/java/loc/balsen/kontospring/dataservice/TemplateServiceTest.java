package loc.balsen.kontospring.dataservice;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;

import java.time.LocalDate;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import loc.balsen.kontospring.data.AccountRecord;
import loc.balsen.kontospring.data.Pattern;
import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.Template;
import loc.balsen.kontospring.data.Assignment;
import loc.balsen.kontospring.repositories.AccountRecordRepository;
import loc.balsen.kontospring.repositories.SubCategoryRepository;
import loc.balsen.kontospring.repositories.TemplateRepository;
import loc.balsen.kontospring.repositories.AssignmentRepository;
import loc.balsen.kontospring.testutil.TestContext;

@RunWith(SpringRunner.class)
@WebAppConfiguration
public class TemplateServiceTest extends TestContext {

	@Autowired
	public AccountRecordRepository accountRecordRepository;

	@Autowired
	public AssignmentRepository assignmentRepository;

	@Autowired
	public SubCategoryRepository kontoRepository;

	@Mock
	public PlanService planService;
	
	@Autowired
	public TemplateRepository templateRepository;
	
	public TemplateService templateService;

	Plan latestPlan;
	Template template;
	Template template1;
	AccountRecord beleg;

	@Before
	public void setUp() throws Exception {
		MockitoAnnotations.initMocks(this);
		createCategoryData();
		createTestData();
		templateService = new TemplateService(planService, templateRepository, accountRecordRepository,
				kontoRepository);
	}

	@After
	public void tearDown() throws Exception {
		clearRepos();
	}

	@Test
	public void testReplan() {
		template1.setValue(200);
		template1.setValidFrom(LocalDate.of(1999, 5, 1));
		when(planService.getLastPlanOf(any(Template.class))).thenReturn(LocalDate.of(1999,4,30));
		
		templateService.saveTemplate(template1);

		ArgumentCaptor<Template> tempcap = ArgumentCaptor.forClass(Template.class);
		verify(planService,times(1)).deactivatePlans(tempcap.capture());
		verify(planService,times(1)).createNewPlansfromTemplate(template1);
		
		Template templateOrig = templateRepository.findById(template.getId()).get();
		assertEquals(template.getId(),tempcap.getValue().getId());
		assertNotEquals(template1.getId(),template.getId());
		assertEquals(template1.getId(),templateOrig.getNext());

		assertEquals(template1.getValidFrom(),templateOrig.getValidUntil().plusDays(1));
	}

	// @Test
	public void testEndTemplate() {
		template.setValidUntil(LocalDate.of(1999, 5, 1));
		templateService.saveTemplate(template);
		verify(planService, times(1)).deactivatePlans(template);
	}

	public void createTestData() {

		AccountRecord beleg = new AccountRecord();
		accountRecordRepository.save(beleg);

		latestPlan = createPlan(null, LocalDate.of(1997, 5, 14), null);

		template = new Template();
		template.setShortDescription("tester");
		template.setDescription("tester");
		template.setAnzahlRythmus(1);
		template.setRythmus(Template.Rythmus.MONTH);
		template.setVardays(5);
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
		template1.setAnzahlRythmus(1);
		template1.setRythmus(Template.Rythmus.MONTH);
		template1.setVardays(5);
		template1.setValidFrom(LocalDate.of(1999, 1, 3));
		template1.setStart(LocalDate.of(1998, 10, 2));
		template1.setPattern(new Pattern("\"sender\": \"gulli1\""));
		template1.setSubCategory(subCategory2);
		template1.setValue(100);
	}
	
	@Test 
	public void testDeleteTemplate( ) {
		templateService.deleteTemplate(template1);
		
		verify(planService,times(1)).detachPlans(template1);
		assertFalse(templateRepository.findById(template.getId()).isPresent());
	}

	private Plan createPlan(Template template, LocalDate plandate, AccountRecord record) {
		Plan plan = new Plan();
		plan.setPlanDate(plandate);
		plan.setDescription("templatetest");
		plan.setPattern(new Pattern("\"sender\": \"gulli0\""));
		plan.setSubCategory(subCategory1);
		plan.setTemplate(template);
		planRepository.save(plan);

		if (record != null) {
			Assignment z = new Assignment();
			z.setPlan(plan);
			z.setAccountrecord(record);
			assignmentRepository.save(z);
		}

		return plan;
	}

}
