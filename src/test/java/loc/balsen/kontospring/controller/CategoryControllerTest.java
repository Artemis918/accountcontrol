package loc.balsen.kontospring.controller;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.Matchers.hasSize;
import static org.junit.Assert.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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

import loc.balsen.kontospring.data.BuchungsBeleg;
import loc.balsen.kontospring.data.SubCategory;
import loc.balsen.kontospring.data.Zuordnung;
import loc.balsen.kontospring.dto.SubCategoryDTO;
import loc.balsen.kontospring.testutil.TestContext;

@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@WebAppConfiguration
public class CategoryControllerTest extends TestContext {

	@Autowired
	private MockMvc mvc;

	@Before
	public void setup() {
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
		Gson gson = new Gson();
		
		SubCategoryDTO testsub = new SubCategoryDTO();
		testsub.setArt(1);
		testsub.setDescription("testing");
		
		testsub.setCategory(subCategory2.getId());
		MvcResult result = 
			mvc.perform(get("/category/addsub")
					    .contentType(MediaType.APPLICATION_JSON)
					    .content(gson.toJson(testsub))
				)
				.andExpect(status().isOk())
				.andReturn();
		int res = Integer.valueOf(result.getResponse().getContentAsString());
		assertTrue(res>0);
		assertTrue(subCategoryRepository.findById(res).isPresent());

		testsub.setCategory(subCategory3.getId());
		result = 
			mvc.perform(get("/category/addsub")
					    .contentType(MediaType.APPLICATION_JSON)
					    .content(gson.toJson(testsub))
				)
				.andExpect(status().isOk())
				.andReturn();
		res = Integer.valueOf(result.getResponse().getContentAsString());
		assertTrue(res>0);
		assertTrue(subCategoryRepository.findById(res).isPresent());

		testsub.setCategory(subCategory3.getId());
		mvc.perform(get("/category/addsub")
			    .contentType(MediaType.APPLICATION_JSON)
			    .content(gson.toJson(testsub))
		)
		.andExpect(status().isOk())
	    .andExpect(content().string("-2")); // twice

		testsub.setCategory(20);
		mvc.perform(get("/addsub")
			    .contentType(MediaType.APPLICATION_JSON)
			    .content(gson.toJson(testsub))
		)
		.andExpect(status().isOk())
	    .andExpect(content().string("-1")); // wrong category 


	}

}
