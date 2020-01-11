package loc.balsen.kontospring.controller;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.Matchers.hasSize;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.google.gson.Gson;
import com.jayway.jsonpath.spi.json.GsonJsonProvider;

import loc.balsen.kontospring.data.AccountRecord;
import loc.balsen.kontospring.data.Category;
import loc.balsen.kontospring.data.SubCategory;
import loc.balsen.kontospring.data.Zuordnung;
import loc.balsen.kontospring.dto.CategoryDTO;
import loc.balsen.kontospring.dto.SubCategoryDTO;
import loc.balsen.kontospring.testutil.TestContext;

@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@WebAppConfiguration
public class CategoryControllerTest extends TestContext {

	private Gson gson;
	
	@Autowired
	private MockMvc mvc;

	@Before
	public void setup() {
		gson = new Gson();
		createCategoryData();
	}

	@After
	public void teardown() {
		clearRepos();
	}
	
	@Test
	public void testCategory() throws Exception {
		mvc.perform(get("/category/catenum")
				   .contentType(MediaType.APPLICATION_JSON))
				   .andExpect(status().isOk())
				   .andExpect(jsonPath("$.[2].text", is("Category3")))
				   .andExpect(jsonPath("$.[0].value", is(1)))
				   .andExpect(jsonPath("$.[2].value", is(3)));

		mvc.perform(get("/category/cat")
				   .contentType(MediaType.APPLICATION_JSON))
				   .andExpect(status().isOk())
				   .andExpect(jsonPath("$.[2].shortdescription", is("Category3")))
				   .andExpect(jsonPath("$.[0].id", is(1)))
				   .andExpect(jsonPath("$.[2].id", is(3)));
	}
	
	@Test
	public void testSubCategories() throws Exception {
		mvc.perform(get("/category/subenum/1")
				   .contentType(MediaType.APPLICATION_JSON))
				   .andExpect(status().isOk())
				   .andExpect(jsonPath("$[*]", hasSize(4)))
				   .andExpect(jsonPath("$.[0].text", is("s1shortDesc")))
				   .andExpect(jsonPath("$.[2].value", is(3)));

		mvc.perform(get("/category/subenum/2")
				   .contentType(MediaType.APPLICATION_JSON))
				   .andExpect(status().isOk())
				   .andExpect(jsonPath("$[*]", hasSize(1)))
				   .andExpect(jsonPath("$.[0].text", is("s5shortDesc")))
				   .andExpect(jsonPath("$.[0].value", is(5)));		

		mvc.perform(get("/category/sub/2")
				   .contentType(MediaType.APPLICATION_JSON))
				   .andExpect(status().isOk())
				   .andExpect(jsonPath("$[*]", hasSize(1)))
				   .andExpect(jsonPath("$.[0].shortdescription", is("s5shortDesc")))
				   .andExpect(jsonPath("$.[0].id", is(5)));		
	}

	
	@Test
	public void addSubCategory() throws Exception {
		
		SubCategoryDTO testsub = new SubCategoryDTO();
		testsub.setArt(1);
		testsub.setDescription("testing");
		
		//some subcategory
		testsub.setCategory(category2.getId());
		MvcResult result = 
			mvc.perform(post("/category/savesub")
					    .contentType(MediaType.APPLICATION_JSON)
					    .content(gson.toJson(testsub))
				)
				.andExpect(status().isOk())
				.andReturn();
		int res = Integer.valueOf(result.getResponse().getContentAsString());
		assertTrue(res>0);
		assertTrue(subCategoryRepository.findById(res).isPresent());

		// same sub in other category
		testsub.setCategory(category3.getId());
		result = 
			mvc.perform(post("/category/savesub")
					    .contentType(MediaType.APPLICATION_JSON)
					    .content(gson.toJson(testsub))
				)
				.andExpect(status().isOk())
				.andReturn();
		res = Integer.valueOf(result.getResponse().getContentAsString());
		assertTrue(res>0);
		assertTrue(subCategoryRepository.findById(res).isPresent());
		
		// same sub and category
		mvc.perform(post("/category/savesub")
			    .contentType(MediaType.APPLICATION_JSON)
			    .content(gson.toJson(testsub))
		)
		.andExpect(status().isOk())
	    .andExpect(content().string("-1")); // twice

		// modify sub
		testsub.setId(res);
		testsub.setDescription("testingNew");
		result = 
			mvc.perform(post("/category/savesub")
					    .contentType(MediaType.APPLICATION_JSON)
					    .content(gson.toJson(testsub))
				)
				.andExpect(status().isOk())
				.andReturn();
		int resnew = Integer.valueOf(result.getResponse().getContentAsString());
		assertEquals(resnew, res );
		assertTrue(subCategoryRepository.findById(res).isPresent());
		assertEquals("testingNew", subCategoryRepository.findById(res).get().getDescription());
		
		
		// illegal cat
		testsub.setCategory(20);
		mvc.perform(post("/category/savesub")
			    .contentType(MediaType.APPLICATION_JSON)
			    .content(gson.toJson(testsub))
		)
		.andExpect(status().isOk())
	    .andExpect(content().string("-2")); // wrong category 
	}

	@Test
	public void addCategory() throws Exception {
		
		CategoryDTO testcat = new CategoryDTO();

		// insert some cat
		testcat.setDescription("testing");
		MvcResult result = 
			mvc.perform(post("/category/savecat")
					    .contentType(MediaType.APPLICATION_JSON)
					    .content(gson.toJson(testcat))
				)
				.andExpect(status().isOk())
				.andReturn();
		int res = Integer.valueOf(result.getResponse().getContentAsString());
		assertTrue(res>0);
		assertTrue(categoryRepository.findById(res).isPresent());

		// same cat again
		mvc.perform(post("/category/savecat")
			    .contentType(MediaType.APPLICATION_JSON)
			    .content(gson.toJson(testcat))
		)
		.andExpect(status().isOk())
		.andExpect(content().string("-1")); // twice

		// modify cat
		testcat.setId(res);
		testcat.setShortdescription("testingNew");
		result = 
			mvc.perform(post("/category/savecat")
					    .contentType(MediaType.APPLICATION_JSON)
					    .content(gson.toJson(testcat))
				)
				.andExpect(status().isOk())
				.andReturn();
		int resnew = Integer.valueOf(result.getResponse().getContentAsString());
		assertEquals(resnew, res);
		assertTrue(categoryRepository.findById(res).isPresent());
		assertEquals("testingNew", categoryRepository.findById(res).get().getShortdescription());
		
   }

	@Test
	public void delUnassignedSubCategory() throws Exception {
		
		Category delcat = new Category();
		delcat.setShortdescription("toDelete2");
		categoryRepository.save(delcat);

		SubCategory delsub1 = new SubCategory();
		delsub1.setCategory(delcat);
		delsub1.setShortdescription("toDelete2");
		subCategoryRepository.save(delsub1);
		
		mvc.perform(get("/category/delsub/" + Integer.toString(delsub1.getId()))
				    .contentType(MediaType.APPLICATION_JSON)
			)
			.andExpect(status().isOk());
		assertFalse(categoryRepository.findById(delsub1.getId()).isPresent());
	}

	@Test
	public void delCategory() throws Exception {
		
			Category delcat = new Category();
			delcat.setShortdescription("toDelete");
			categoryRepository.save(delcat);
			
			mvc.perform(get("/category/delcat/" + delcat.getId())
					    .contentType(MediaType.APPLICATION_JSON)
				)
				.andExpect(status().isOk());
			assertFalse(categoryRepository.findById(delcat.getId()).isPresent());
	}

	@Test
	public void delCategoryTree() throws Exception {
		
		Category delcat = new Category();
		delcat.setShortdescription("toDelete1");
		categoryRepository.save(delcat);

		SubCategory delsub1 = new SubCategory();
		delsub1.setCategory(delcat);
		delsub1.setShortdescription("toDelete1");
		subCategoryRepository.save(delsub1);
		
		SubCategory delsub2 = new SubCategory();
		delsub2.setCategory(delcat);
		delsub2.setShortdescription("toDelete2");
		subCategoryRepository.save(delsub2);
		
		AccountRecord record = new AccountRecord();
		assignRecordRepository.save(record);
		
		Zuordnung assign = new Zuordnung();
		assign.setAccountrecord(record);
		assign.setSubcategory(delsub1);
		
		mvc.perform(get("/category/delcat/" + delcat.getId())
					    .contentType(MediaType.APPLICATION_JSON)
				)
			.andExpect(status().isOk());

		assertFalse(categoryRepository.findById(delcat.getId()).isPresent());
		assertFalse(subCategoryRepository.findById(delsub1.getId()).isPresent());
		assertFalse(subCategoryRepository.findById(delsub2.getId()).isPresent());
		assertFalse(zuordnungRepository.findById(assign.getId()).isPresent());
		assertTrue(assignRecordRepository.findById(record.getId()).isPresent());
	}
}
