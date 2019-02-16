package loc.balsen.kontospring.dataservice;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.Template;
import loc.balsen.kontospring.repositories.PlanRepository;
import loc.balsen.kontospring.repositories.TemplateRepository;

@Component
public class PlanService {

	@Autowired
	private TemplateRepository templateRepository;

	@Autowired
	private PlanRepository planRepository;

	private LocalDate end;

	private LocalDate start;

	public void createPlansfromTemplatesUntil(int month, int year) {

		LocalDate last = planRepository.findMaxPlanDate();
		if (last == null)
			last = LocalDate.now();

		if (last.getMonth().getValue() == month && last.getYear() == year)
			return;

		end = LocalDate.of(year, month, 1);
		end = end.withDayOfMonth(end.lengthOfMonth());
		start = last.plusMonths(1).withDayOfMonth(1);

		List<Template> templates = templateRepository.findAll();
		templates.stream().filter((t) -> isTemplateRange(t)).forEach((t) -> createPlans(t, null, null));
	}

	public void createPlansfromTemplate(Template template) {
		createPlansfromTemplate(template, null, null);
	}
	
	public void createPlansfromTemplate(Template template, LocalDate excludeFrom, LocalDate excludeUntil) {

		LocalDate last = planRepository.findMaxPlanDate();
		if (last == null)
			last = LocalDate.now();
		end = LocalDate.of(last.getYear(), last.getMonth(), 1);
		end = end.withDayOfMonth(end.lengthOfMonth());
		start = template.getValidFrom();

		createPlans(template, excludeFrom, excludeUntil);
	}

	private void createPlans(Template template, LocalDate excludeFrom, LocalDate excludeUntil ) {
		
		for (LocalDate nextDate = template.getStart();
		     !nextDate.isAfter(end);
			 nextDate = template.increaseDate(nextDate)
			) {

			if ( nextDate.isBefore(template.getValidFrom())) 
				continue;
				
			if (excludeFrom!=null && excludeUntil!= null &&  !(nextDate.isBefore(excludeFrom) || nextDate.isAfter(excludeUntil)) )
				continue;
			
			if ( template.getValidUntil() != null && nextDate.isAfter(template.getValidUntil()))
				continue;
					
			planRepository.save(new Plan(template, nextDate));
		}
	}

	public void deactivateUnassignedPlans(Template template) {
		List<Plan> plans = planRepository.findActiveByTemplateNotAssigned(template.getId());
		for (Plan plan : plans)
			deactivatePlan(plan);
	}

	public List<Plan> deactivatePlans(Template template) {
		LocalDate endDate = template.getValidUntil();

		List<Plan> plans = planRepository.findActiveByTemplateNotAssigned(template.getId());
		List<Plan> result = new ArrayList<Plan>();
		plans.stream().filter((p) -> {
			return p.getPlanDate().isAfter(endDate);
		}).forEach((p) -> {
			deactivatePlan(p);
			result.add(p);
		});
		return result;
	}

	public void deactivatePlan(Plan p) {
		p.setDeactivateDate(LocalDate.now());
		planRepository.save(p);
	}

	private boolean isTemplateRange(Template template) {
		if (template.getValidFrom().isBefore(start)
				&& (template.getValidUntil() == null || !template.getValidUntil().isBefore(start))) {
			return true;
		} else if (!template.getValidFrom().isAfter(end)) {
			return true;
		} else
			return false;
	}

}
