package loc.balsen.kontospring.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertSame;
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

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import com.google.gson.Gson;

import loc.balsen.kontospring.data.AccountRecord;
import loc.balsen.kontospring.data.SubCategory;
import loc.balsen.kontospring.data.Pattern;
import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.Template;
import loc.balsen.kontospring.data.Assignment;
import loc.balsen.kontospring.dataservice.TemplateService;
import loc.balsen.kontospring.dataservice.AssignmentService;
import loc.balsen.kontospring.repositories.AssignmentRepository;
import loc.balsen.kontospring.testutil.TestContext;

@RunWith(SpringRunner.class)
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
	private ArgumentCaptor<List<AccountRecord>> captor;
	
	@Before
	public void setup() {
		MockitoAnnotations.initMocks(this);
		createCategoryData();
	}
	
	@After
	public void teardown() {
		clearRepos();
	}
	
	
	@Test
	public void testCount() throws Exception {
		Gson gson =  new Gson();
				
		AccountRecord record = new AccountRecord();
		record.setReferenz("testrec");
		assignRecordRepository.save(record);
		Assignment assignment =  new Assignment();
		assignment.setAccountrecord(record);
		assignment.setSubcategory(subCategory1);
		
		List<Integer> list =  new ArrayList<>();
		list.add(new Integer(subCategory1.getId()));
		
		assignmentRepository.save(assignment);
    	mvc.perform(post("/assign/countsubcategory")
			    .contentType(MediaType.APPLICATION_JSON)
			    .content(gson.toJson(list))
		).andExpect(status().isOk())
		 .andExpect(content().string("1"));

		list.add(new Integer(subCategory2.getId()));
    	mvc.perform(post("/assign/countsubcategory")
			    .contentType(MediaType.APPLICATION_JSON)
			    .content(gson.toJson(list))
		).andExpect(status().isOk())
		 .andExpect(content().string("1"));
	}
	
	@Test
	public void testReplan() {
		AccountRecord record =  new AccountRecord();
		Plan plan = new Plan();
		Template template = new Template();
		
		Assignment assignment =  new Assignment();
		assignment.setId(1200);
		assignment.setAccountrecord(record);


		when(mockAssignmentRepository.getOne(Integer.valueOf(100))).thenReturn(assignment);
		
		AssignmentController controller =  new AssignmentController(null, mockAssignmentRepository, mockAssignmentService, 
				mockTemplateService, null, null);
		
		// do nothing
		controller.replan(100);
		
		assignment.setPlan(plan);
		controller.replan(100);
		
		plan.setTemplate(template);	
		controller.replan(100);

		verify(mockAssignmentRepository,times(1)).delete(assignment);
		verify(mockTemplateService,times(1)).saveTemplate(template);
		
		verify(mockAssignmentService,times(1)).assign(captor.capture());
		
		assertSame(record, captor.getValue().get(0));

	}

	@Test
	public void testAssign() throws Exception {

		LocalDate today = LocalDate.now();
		int month = today.getMonthValue();
		int year = today.getYear();

		createRecord("test1 blabla");
		createRecord("test2 blabla");
		createRecord("test3 bleble");
		createRecord("test4 bleble");
		createPlan("1", subCategory1);
		createPlan("2", subCategory2);
		createPlan("3", subCategory5);

		mvc.perform(get("/assign/all")).andExpect(status().isOk());
		assertEquals(3, assignmentRepository.findAll().size());

		mvc.perform(get("/assign/getcategory/" + year + "/" + month + "/" + category1.getId()))
				.andExpect(status().isOk()).andExpect(jsonPath("$.[*]", hasSize(2)));

		mvc.perform(get("/assign/getcategory/" + year + "/" + month + "/" + category2.getId()))
				.andExpect(status().isOk()).andExpect(jsonPath("$.[*]", hasSize(1)));

		mvc.perform(get("/assign/getcategory/" + year + "/" + month + "/" + category3.getId()))
				.andExpect(status().isOk()).andExpect(jsonPath("$.[*]", hasSize(0)));

		mvc.perform(get("/assign/getsubcategory/" + year + "/" + month + "/" + subCategory1.getId())).andExpect(status().isOk())
				.andExpect(jsonPath("$.[*]", hasSize(1)));

	}

	@Test
	public void testAssignKonto() throws Exception {
		
		AccountRecord record2 = createRecord("test5 bleble");
		AccountRecord record1 =createRecord("test6 bleble");
		
		String json = "{ \"text\": \"helpme\""
				    + ", \"subcategory\": " + subCategory4.getId() 
				    + ", \"ids\": [ " + record1.getId() +"," +record2.getId() + " ] }";
		
		mvc.perform(post("/assign/tosubcategory")
				.content(json)
				.contentType(MediaType.APPLICATION_JSON))
		        .andExpect(status().isOk());
		
		List<Assignment> assignList = assignmentRepository.findByShortdescription("helpme");
		assertEquals(2, assignList.size());
	}
	
	private AccountRecord createRecord(String description) {
		AccountRecord result = new AccountRecord();
		result.setDetails(description);
		result.setWertstellung(LocalDate.now());
		result.setCreation(LocalDate.now());
		assignRecordRepository.save(result);
		return result;
	}

	private Plan createPlan(String detailmatch, SubCategory subCategory) {
		Plan plan = new Plan();
		plan.setDescription("short: " + detailmatch);
		plan.setStartDate(LocalDate.now().minusDays(2));
		plan.setPlanDate(LocalDate.now());
		plan.setEndDate(LocalDate.now().plusDays(2));
		plan.setSubCategory(subCategory);
		plan.setPattern(new Pattern("{\"details\": \"" + detailmatch + "\"}"));
		planRepository.save(plan);
		return plan;
	}
}
