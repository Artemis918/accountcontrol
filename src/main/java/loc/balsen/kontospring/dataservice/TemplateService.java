package loc.balsen.kontospring.dataservice;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import loc.balsen.kontospring.data.BuchungsBeleg;
import loc.balsen.kontospring.data.Konto;
import loc.balsen.kontospring.data.Plan.MatchStyle;
import loc.balsen.kontospring.data.Template;
import loc.balsen.kontospring.repositories.BuchungsBelegRepository;
import loc.balsen.kontospring.repositories.KontoRepository;
import loc.balsen.kontospring.repositories.PlanRepository;
import loc.balsen.kontospring.repositories.TemplateRepository;

@Component
public class TemplateService {

	private static final int KONTO_DEFAULT = 1;

	@Autowired
	PlanService planService;
	
	@Autowired
	PlanRepository planRepository;

	@Autowired
	TemplateRepository templateRepository;

	@Autowired
	BuchungsBelegRepository buchungsBelegRepository;

	@Autowired
	KontoRepository kontoRepository;

	public void saveTemplate(Template template) {

		if (template.getId() == 0) {
			templateRepository.save(template);
			planService.createPlansfromTemplate(template);
		} else if (template.getMatchStyle() == MatchStyle.PATTERN){
			templateRepository.save(template);
		}
		else {
			Template templateOrig = templateRepository.findById(template.getId()).get();

			if (templateOrig.equalsExceptValidPeriod(template)) {
				changeValidPeriod(templateOrig, template.getValidFrom(), template.getValidUntil());
			} else {
				replanUnassigned(template, templateOrig);
			}
		}
	}

	public void replanUnassigned(Template template, Template templateOrig) {

		template.setId(0);
		templateRepository.save(template);
		
		templateOrig.setValidUntil(template.getValidFrom());
		templateOrig.setNext(template.getId());
		templateRepository.save(templateOrig);
		
		planService.deactivateUnassignedPlans(templateOrig);
		LocalDate excludeFrom = planRepository.findMinPlanDateByTemplate(templateOrig.getId());
		LocalDate excludeUntil = planRepository.findMaxPlanDateByTemplate(templateOrig.getId());

		planService.createPlansfromTemplate(template,excludeFrom,excludeUntil);
	}

	private void changeValidPeriod(Template templateOrig, LocalDate validFrom, LocalDate validUntil) {
		planService.deactivateUnassignedPlans(templateOrig);
		LocalDate excludeFrom = planRepository.findMinPlanDateByTemplate(templateOrig.getId());
		LocalDate excludeUntil = planRepository.findMaxPlanDateByTemplate(templateOrig.getId());
		planService.createPlansfromTemplate(templateOrig,excludeFrom,excludeUntil);
	}
	
	public Template createFromBeleg(Integer id) {
		Optional<BuchungsBeleg> beleg = buchungsBelegRepository.findById(id);
		if (beleg.isPresent()) {
			Konto konto = kontoRepository.findById(KONTO_DEFAULT).get();
			Template template = new Template(beleg.get());
			template.setKonto(konto);
			return template;
		}
		return new Template();
	}
}
