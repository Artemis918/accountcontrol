package loc.balsen.kontospring.dataservice;

import static org.junit.Assert.assertEquals;

import java.time.LocalDate;
import java.util.List;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import loc.balsen.kontospring.data.Pattern;
import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.Template;
import loc.balsen.kontospring.testutil.TestContext;

@RunWith(SpringRunner.class)
@WebAppConfiguration
public class PlanServiceTest extends TestContext {

	@Autowired
	PlanService planService;

	@Before
	public void setup() {
		createKontoData();
	}
	
	@After
	public void teardown() {
		clearRepos();
	}
	
	@Test
	public void testcreatePlansfromTemplate() {

		Plan plan = new Plan();
		plan.setPlanDate(LocalDate.of(1997, 5, 14));
		plan.setDescription("templatetest");
		plan.setPattern(new Pattern("\"sender\": \"gulli0\""));
		plan.setKonto(konto1);
		planRepository.save(plan);

		Template template = new Template();
		template.setShortDescription("tester");
		template.setAnzahlRythmus(1);
		template.setRythmus(Template.Rythmus.MONTH);
		template.setVardays(5);
		template.setValidFrom(LocalDate.of(1999, 1, 3));
		template.setStart(LocalDate.of(1998, 5, 2));
		template.setPattern(new Pattern("\"sender\": \"gulli1\""));
		template.setKonto(konto2);
		templateRepository.save(template);

		Template template2 = new Template();
		template2.setShortDescription("tester2");
		template2.setAnzahlRythmus(1);
		template2.setRythmus(Template.Rythmus.MONTH);
		template2.setVardays(5);
		template2.setValidFrom(LocalDate.of(1999, 1, 3));
		template2.setStart(LocalDate.of(1998, 5, 2));
		template2.setPattern(new Pattern("\"sender\": \"gulli2\""));
		template2.setKonto(konto5);
		templateRepository.save(template2);

		planService.createPlansfromTemplate(template);

		List<Plan> plans = planRepository.findAll();
		assertEquals(1, plans.size());

		plan.setPlanDate(LocalDate.of(1999, 1, 1));
		planRepository.save(plan);

		plans = planRepository.findAll();
		assertEquals(1, plans.size());

		plan.setPlanDate(LocalDate.of(1999, 1, 31));
		planRepository.save(plan);

		plans = planRepository.findAll();
		assertEquals(1, plans.size());

		plan.setPlanDate(LocalDate.of(1999, 2, 1));
		planRepository.save(plan);
		planService.createPlansfromTemplate(template);

		plans = planRepository.findAll();
		assertEquals(2, plans.size());

		Plan createdplan = (plans.get(1).getId() == 2) ? plans.get(1) : plans.get(0);

		assertEquals("tester", createdplan.getShortDescription());
		assertEquals(LocalDate.of(1999, 2, 2), createdplan.getPlanDate());
		assertEquals(LocalDate.of(1999, 1, 28), createdplan.getStartDate());
		assertEquals(LocalDate.of(1999, 2, 7), createdplan.getEndDate());
		assertEquals(template, createdplan.getTemplate());
		assertEquals(LocalDate.now(), createdplan.getCreationDate());

		plan.setPlanDate(LocalDate.of(1999, 4, 30));
		planRepository.save(plan);
		planService.createPlansfromTemplate(template);
		plans = planRepository.findAll();
		assertEquals(4, plans.size());

		template.setValidUntil(LocalDate.of(1999, 6, 2));
		templateRepository.save(template);

		plan.setPlanDate(LocalDate.of(1999, 8, 30));
		planRepository.save(plan);
		planService.createPlansfromTemplate(template);
		plans = planRepository.findAll();
		assertEquals(6, plans.size());

		// TestUntil
		template.setValidUntil(null);
		templateRepository.save(template);
		
		planService.createPlansfromTemplatesUntil(8,1999);
		plans = planRepository.findAll();
		assertEquals(6, plans.size());
		
		planService.createPlansfromTemplatesUntil(9,1999);
		plans = planRepository.findAll();
		assertEquals(17, plans.size());
		
		// deactivate plans
		template.setValidUntil(LocalDate.of(1999,9,15));
		templateRepository.save(template);
		planService.deactivatePlans(template);
		plans = planRepository.findAll();
		long deactivated = plans.stream().filter((p)->{return p.getDeactivateDate()!=null;}).count();
		assertEquals(0, deactivated);

		template.setValidUntil(LocalDate.of(1999,9,2));
		templateRepository.save(template);
		planService.deactivatePlans(template);
		plans = planRepository.findAll();
		deactivated = plans.stream().filter((p)->{return p.getDeactivateDate()!=null;}).count();
		assertEquals(0, deactivated);

		template.setValidUntil(LocalDate.of(1999,9,1));
		templateRepository.save(template);
		planService.deactivatePlans(template);
		plans = planRepository.findAll();
		deactivated = plans.stream().filter((p)->{return p.getDeactivateDate()!=null;}).count();
		assertEquals(1, deactivated);
		
		template.setValidUntil(LocalDate.of(1999,7,1));
		templateRepository.save(template);
		planService.deactivatePlans(template);
		plans = planRepository.findAll();
		deactivated = plans.stream().filter((p)->{return p.getDeactivateDate()!=null;}).count();
		assertEquals(3, deactivated);

	}
}
