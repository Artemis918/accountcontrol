package loc.balsen.kontospring.dataservice;

import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import loc.balsen.kontospring.data.BuchungsBeleg;
import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.Zuordnung;
import loc.balsen.kontospring.repositories.PlanRepository;
import loc.balsen.kontospring.repositories.ZuordnungRepository;
import loc.balsen.kontospring.testutil.TestContext;

@RunWith(SpringRunner.class)
@WebAppConfiguration
public class StatsServiceTest extends TestContext {

	@Mock
	private PlanRepository planRepository;
	
	@Mock
	private ZuordnungRepository zuordnungRepository;
	
	private StatsService statsService;
	
	@Before
	public void setUp() throws Exception {
		createKontoData();
		statsService = new StatsService(zuordnungRepository, planRepository);
	}

	@After
	public void tearDown() throws Exception {
		clearRepos();
	}

	@Test
	public void testGetCummulatedPlans() {
		
		List<Plan> planlist=  new ArrayList<>();
		
		Plan plan1 = new Plan();
		plan1.setPlanDate(LocalDate.of(2018, 12, 3));
		plan1.setWert(15);
		planlist.add(plan1);

		Plan plan2 = new Plan();
		plan2.setPlanDate(LocalDate.of(2018, 12, 3));
		plan2.setWert(10);
		planlist.add(plan2);

		Plan plan3 = new Plan();
		plan3.setPlanDate(LocalDate.of(2019, 2, 19));
		plan3.setWert(-5);
		planlist.add(plan3);

		Plan plan4 = new Plan();
		plan4.setPlanDate(LocalDate.of(2019, 2, 28));
		plan4.setWert(-24);
		planlist.add(plan4);

		Plan plan5 = new Plan();
		plan5.setPlanDate(LocalDate.of(2019, 3, 13));
		plan5.setWert(12);
		planlist.add(plan5);
		
		when(planRepository.findByPlanDate(any(LocalDate.class), any(LocalDate.class))).thenReturn(planlist);
		
		List<Integer> result = statsService.getMonthlyCumulatedPlan(LocalDate.of(2018,10,3), LocalDate.of(2019,5,3));
		
		assertEquals(8, result.size());
		assertEquals(0, result.get(0).intValue());
		assertEquals(0, result.get(1).intValue());
		assertEquals(25, result.get(2).intValue());
		assertEquals(25, result.get(3).intValue());
		assertEquals(-4, result.get(4).intValue());
		assertEquals(8, result.get(5).intValue());
		assertEquals(8, result.get(6).intValue());
		assertEquals(8, result.get(7).intValue());	
	}

	@Test
	public void testGetCummulatedAssigns() {
		
		List<Zuordnung> zgeplantlist=  new ArrayList<>();
		List<Zuordnung> zungeplantlist=  new ArrayList<>();
		
		BuchungsBeleg beleg1 = new BuchungsBeleg();
		beleg1.setWertstellung(LocalDate.of(2018, 12, 1));
		
		Zuordnung zuordnung1 = new Zuordnung();
		zuordnung1.setBuchungsbeleg(beleg1);
		zuordnung1.setWert(100);
		zungeplantlist.add(zuordnung1);

		BuchungsBeleg beleg2 = new BuchungsBeleg();
		beleg2.setWertstellung(LocalDate.of(2019, 1, 4));

		Plan plan2 = new Plan();
		plan2.setPlanDate(LocalDate.of(2018, 12, 3));

		Zuordnung zuordnung2 = new Zuordnung();
		zuordnung2.setBuchungsbeleg(beleg2);
		zuordnung2.setWert(110);
		zuordnung2.setPlan(plan2);
		zgeplantlist.add(zuordnung2);

		BuchungsBeleg beleg3 = new BuchungsBeleg();
		beleg3.setWertstellung(LocalDate.of(2019, 2, 2));

		Zuordnung zuordnung3 = new Zuordnung();
		zuordnung3.setBuchungsbeleg(beleg3);
		zuordnung3.setWert(-2);
		zungeplantlist.add(zuordnung3);

		BuchungsBeleg beleg4 = new BuchungsBeleg();
		beleg4.setWertstellung(LocalDate.of(2019, 2, 28));

		Zuordnung zuordnung4 = new Zuordnung();
		zuordnung4.setBuchungsbeleg(beleg4);
		zuordnung4.setWert(-12);
		zungeplantlist.add(zuordnung4);

		BuchungsBeleg beleg5 = new BuchungsBeleg();
		beleg5.setWertstellung(LocalDate.of(2019, 1, 1));
		
		Plan plan5 = new Plan();
		plan5.setPlanDate(LocalDate.of(2019, 3, 1));
		
		Zuordnung zuordnung5 = new Zuordnung();
		zuordnung5.setBuchungsbeleg(beleg5);
		zuordnung5.setWert(17);
		zuordnung5.setPlan(plan5);
		zgeplantlist.add(zuordnung5);
		
		when(zuordnungRepository.findAllPlannedByPeriod(any(LocalDate.class), any(LocalDate.class))).thenReturn(zgeplantlist);
		when(zuordnungRepository.findAllNotPlannedByPeriod(any(LocalDate.class), any(LocalDate.class))).thenReturn(zungeplantlist);
		
		List<Integer> result = statsService.getMonthlyCumulatedAssigns(LocalDate.of(2018,10,3), LocalDate.of(2019,5,3));
		
		assertEquals(8, result.size());
		assertEquals(0, result.get(0).intValue());
		assertEquals(0, result.get(1).intValue());
		assertEquals(210, result.get(2).intValue());
		assertEquals(210, result.get(3).intValue());
		assertEquals(196, result.get(4).intValue());
		assertEquals(213, result.get(5).intValue());
		assertEquals(213, result.get(6).intValue());
		assertEquals(213, result.get(7).intValue());	
	}

	
}
