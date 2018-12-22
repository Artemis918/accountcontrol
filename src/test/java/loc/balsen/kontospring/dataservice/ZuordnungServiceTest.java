package loc.balsen.kontospring.dataservice;

import static org.junit.Assert.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import loc.balsen.kontospring.Application;
import loc.balsen.kontospring.data.BuchungsBeleg;
import loc.balsen.kontospring.data.Pattern;
import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.Zuordnung;
import loc.balsen.kontospring.repositories.BuchungsBelegRepository;
import loc.balsen.kontospring.repositories.PlanRepository;
import loc.balsen.kontospring.repositories.ZuordnungRepository;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = Application.class)
@TestPropertySource("classpath:/h2database.properties")
public class ZuordnungServiceTest {

	@Autowired
	PlanRepository planRepository;
	
	@Autowired
	ZuordnungService zuordnungService;
	
	@Autowired
	ZuordnungRepository zuordnungRepository;
	
	@Autowired
	BuchungsBelegRepository buchungsbelegRepository;
	
	List<Plan> plans; 
	
	@Before
	public void setup() {
		plans =  new ArrayList<>();
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
		
	}
	
	private void createplan(String start, String end, String pattern) {
		Plan plan= new Plan();
		plan.setStartDate(LocalDate.parse(start));
		plan.setPlanDate(LocalDate.parse(start).plusDays(2));
		plan.setEndDate(LocalDate.parse(end));
		plan.setPattern(new Pattern(pattern));
		plan.setWert(25);
		planRepository.save(plan);
		plans.add(plan);
	}

}
