package loc.balsen.kontospring.dataservice;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.test.context.junit4.SpringRunner;

import loc.balsen.kontospring.data.BuchungsBeleg;
import loc.balsen.kontospring.data.Pattern;
import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.Zuordnung;
import loc.balsen.kontospring.data.Plan.MatchStyle;
import loc.balsen.kontospring.testutil.TestContext;

@RunWith(SpringRunner.class)
public class ZuordnungServiceTest extends TestContext {
	
	@Autowired
	ZuordnungService zuordnungService;
	
	List<Plan> plans;
	
	@Before
	public void setup() {
		plans =  new ArrayList<>();
		createKontoData();
	}
	
	@After
	public void teardown() {
		clearRepos();
	}
	
	@Test
	public void test() {
		createPlans();
		
		// no match
		List<BuchungsBeleg> buchungen1 =  new ArrayList<>();
		buchungen1.add(createBeleg("2018-01-02","2345"));
		zuordnungService.assign(buchungen1);
		List<Zuordnung> zuordnungen = zuordnungRepository.findAll();
		assertEquals(0,zuordnungen.size());

		//one match
		List<BuchungsBeleg> buchungen2 =  new ArrayList<>();
		buchungen2.add(createBeleg("2018-01-02","1234"));
		zuordnungService.assign(buchungen2);
		zuordnungen = zuordnungRepository.findAll(Sort.by("id"));
		assertEquals(1,zuordnungen.size());
		Zuordnung zuordnung = zuordnungen.get(0);
		assertEquals(buchungen2.get(0), zuordnung.getBuchungsbeleg());
		assertEquals(plans.get(0),zuordnung.getPlan());
		assertEquals(0.7, zuordnung.getEuroWert().doubleValue(),0);

		// second call -> no additional matches
		zuordnungService.assign(buchungen2);
		zuordnungen = zuordnungRepository.findAll(Sort.by("id"));
		assertEquals(1,zuordnungen.size());

		// two matches
		List<BuchungsBeleg> buchungen3 =  new ArrayList<>();
		buchungen3.add(createBeleg("2018-01-09","3456"));
		zuordnungService.assign(buchungen3);
		zuordnungen = zuordnungRepository.findAll(Sort.by("id"));
		assertEquals(3,zuordnungen.size());
		assertEquals(0.25, zuordnungen.get(1).getEuroWert().doubleValue(),0);
		assertEquals(0.45, zuordnungen.get(2).getEuroWert().doubleValue(),0);
		
		// more than one 
		List<BuchungsBeleg> buchungen4 =  new ArrayList<>();
		buchungen4.add(createBeleg("2018-01-04","2345"));
		buchungen4.add(createBeleg("2018-01-25","5678"));
		zuordnungService.assign(buchungen4);
		zuordnungen = zuordnungRepository.findAll(Sort.by("id"));
		assertEquals(5,zuordnungen.size());	
				
		// pattern
		List<BuchungsBeleg> buchungen5 =  new ArrayList<>();
		buchungen5.add(createBeleg("2018-01-04","a98765"));
		zuordnungService.assign(buchungen5);
		zuordnungen = zuordnungRepository.findAll(Sort.by("id"));
		assertEquals(6,zuordnungen.size());	
		assertNull(zuordnungen.get(5).getPlan());
	}
	
	private BuchungsBeleg createBeleg(String date, String mandat) {
		BuchungsBeleg beleg = new BuchungsBeleg();
		beleg.setMandat(mandat);
		beleg.setBeleg(LocalDate.parse(date));
		beleg.setWert(70);
		buchungsbelegRepository.save(beleg);
		return beleg;
	}
	
	private void createPlans() {
		createplan("2018-01-01", "2018-01-07", "{\"mandat\": \"1234\"}");
		createplan("2018-01-04", "2018-01-12", "{\"mandat\": \"2345\"}");
		createplan("2018-01-08", "2018-01-16", "{\"mandat\": \"3456\"}");
		createplan("2018-01-08", "2018-01-19", "{\"mandat\": \"3456\"}");
		createplan("2018-01-17", "2018-01-25", "{\"mandat\": \"5678\"}");
		createplan("2018-01-17", "{\"mandat\": \"9876\"}");
		
	}
	
	private void createplan(String start, String end, String pattern) {
		Plan plan= new Plan();
		plan.setStartDate(LocalDate.parse(start));
		plan.setPlanDate(LocalDate.parse(start).plusDays(2));
		plan.setEndDate(LocalDate.parse(end));
		plan.setPattern(new Pattern(pattern));
		plan.setWert(25);
		plan.setSubCategory(subCategory1);
		planRepository.save(plan);
		plans.add(plan);
	}
	
	private void createplan(String start, String pattern) {
		Plan plan= new Plan();
		plan.setStartDate(LocalDate.parse(start));
		plan.setPlanDate(LocalDate.parse(start).plusDays(2));
		plan.setPattern(new Pattern(pattern));
		plan.setMatchStyle(MatchStyle.PATTERN);
		plan.setWert(25);
		plan.setSubCategory(subCategory2);
		planRepository.save(plan);
		plans.add(plan);
	}

}
