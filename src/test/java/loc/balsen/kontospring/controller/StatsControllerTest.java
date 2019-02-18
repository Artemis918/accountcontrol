package loc.balsen.kontospring.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import loc.balsen.kontospring.dataservice.StatsService;
import loc.balsen.kontospring.testutil.TestContext;

@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@WebAppConfiguration
public class StatsControllerTest extends TestContext {

	@Mock
	private StatsService statistikService;
	
	@InjectMocks
	private StatsController statsController;
	
	@Autowired
	MockMvc mvc;

	@Before
	public void setup() {
		
		MockitoAnnotations.initMocks(this);
		createKontoData();
	}
	
	@After
	public void teardown() {
		clearRepos();
	}

	@Test
	public void test() throws Exception {
		List<Integer> assigns = new ArrayList<Integer>();
		assigns.add(new Integer(2));
		assigns.add(new Integer(3));
		assigns.add(new Integer(4));
		List<Integer> plans = new ArrayList<Integer>();
		plans.add(new Integer(9));
		plans.add(new Integer(8));
		plans.add(new Integer(7));
		
		when(statistikService.getMonthlyCumulatedAssigns(any(LocalDate.class))).thenReturn(assigns);
		when(statistikService.getMonthlyCumulatedPlan(any(LocalDate.class))).thenReturn(plans);
		
		// all Integers are zero in controller, but the lists contain 3 elemts ... strange
		mvc.perform(get("/stats/real/2018/12"))
		   .andExpect(content().string("["
		   		+ "{\"day\":\"2018-12-01\",\"value\":0,\"planvalue\":0},"
		   		+ "{\"day\":\"2019-01-01\",\"value\":0,\"planvalue\":0},"
		   		+ "{\"day\":\"2019-02-01\",\"value\":0,\"planvalue\":0}"
		   		+ "]"));
	}

}
