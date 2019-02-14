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
		templates.stream().filter((t) -> isTemplateRange(t)).forEach((t) -> createPlans(t));
	}

	public void createPlansfromTemplate(Template template) {

		LocalDate last = planRepository.findMaxPlanDate();
		if (last == null)
			last = LocalDate.now();
		end = LocalDate.of(last.getYear(), last.getMonth(), 1);
		end = end.withDayOfMonth(end.lengthOfMonth());
		start = template.getGueltigVon();

		createPlans(template);
	}

	private void createPlans(Template template) {
		LocalDate nextDate = planRepository.findMaxPlanDateByTemplate(template.getId());
		
		if (nextDate == null)
			nextDate = template.getStart();
		else
			nextDate = template.increaseDate(nextDate);

		while (!nextDate.isAfter(end)) {

			if (!nextDate.isBefore(template.getGueltigVon())
					&& (template.getGueltigBis() == null || !nextDate.isAfter(template.getGueltigBis()))) {
				planRepository.save(new Plan(template, nextDate));
			}
			nextDate = template.increaseDate(nextDate);
		}
	}

	public List<Plan> deactivatePlans(Template template) {
		LocalDate endDate = template.getGueltigBis();

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
		if (template.getGueltigVon().isBefore(start)
				&& (template.getGueltigBis() == null || !template.getGueltigBis().isBefore(start))) {
			return true;
		} else if (!template.getGueltigVon().isAfter(end)) {
			return true;
		} else
			return false;
	}

}
