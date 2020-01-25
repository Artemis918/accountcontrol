package loc.balsen.kontospring.dataservice;

import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import loc.balsen.kontospring.data.Pattern;
import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.Template;
import loc.balsen.kontospring.repositories.PlanRepository;
import loc.balsen.kontospring.repositories.TemplateRepository;

@Component
public class PlanService {

	private TemplateRepository templateRepository;
	private PlanRepository planRepository;

	private LocalDate end;
	private LocalDate start;

	@Autowired
	public PlanService( PlanRepository planRepository, TemplateRepository templateRepository) {
		this.planRepository = planRepository;
		this.templateRepository = templateRepository;
	}
	
	public void createPlansfromTemplatesUntil(int month, int year) {

		LocalDate last = planRepository.findMaxPlanDate();
		if (last == null)
			last = LocalDate.now();

		if (last.getMonth().getValue() == month && last.getYear() == year)
			return;

		end = LocalDate.of(year, month, 1);
		end = end.with(TemporalAdjusters.lastDayOfMonth());
		start = last.plusMonths(1).with(TemporalAdjusters.firstDayOfMonth());

		List<Template> templates = templateRepository.findAll();
		templates.stream().filter((t) -> isTemplateRange(t)).forEach((t) -> createPlans(t, t.getValidFrom(), start.minusDays(1)));
	}

	public void createPlansfromTemplate(Template template) {
		createPlansfromTemplate(template, null, null);
	}
	
	public LocalDate getLastPlanOf(Template template) {
		return planRepository.findMaxAssignedPlanDateByTemplate(template.getId());
	}
	
	public void createNewPlansfromTemplate(Template template) {
		LocalDate excludeFrom = planRepository.findMinPlanDateByTemplate(template.getId());
		LocalDate excludeUntil = planRepository.findMaxPlanDateByTemplate(template.getId());
		createPlansfromTemplate(template,excludeFrom,excludeUntil);
	}
	
	private void createPlansfromTemplate(Template template, LocalDate excludeFrom, LocalDate excludeUntil) {

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

	public List<Plan> deactivatePlans(Template template) {
		List<Plan> result = new ArrayList<Plan>();

		LocalDate endDate = template.getValidUntil();
		if (endDate == null)
			return result;
		
		List<Plan> plans = planRepository.findActiveByTemplateNotAssigned(template.getId());
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
	
	public void detachPlans ( Template template ) {
		planRepository.findByTemplate(template).forEach((p) -> { p.setTemplate(null); planRepository.save(p);});
	}
	
	public void replacePattern (Template template, LocalDate from, Pattern newPattern ) {
		List<Plan> plans = planRepository.findByTemplate(template);
		plans.stream().filter((p) -> {
			return !p.getPlanDate().isBefore(from);
		}).forEach((p) -> {
			p.setPattern(newPattern);
			planRepository.save(p);
		});
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
