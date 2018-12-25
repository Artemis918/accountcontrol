package loc.balsen.kontospring.dataservice;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import loc.balsen.kontospring.data.BuchungsBeleg;
import loc.balsen.kontospring.data.Konto;
import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.Template;
import loc.balsen.kontospring.repositories.BuchungsBelegRepository;
import loc.balsen.kontospring.repositories.KontoRepository;
import loc.balsen.kontospring.repositories.TemplateRepository;

@Component
public class TemplateService {

	private static final int KONTO_DEFAULT = 1;

	@Autowired
	PlanService planService;
	
	@Autowired
	TemplateRepository templateRepository;

	@Autowired
	BuchungsBelegRepository buchungsBelegRepository;
	
	@Autowired
	KontoRepository kontoRepository;
	
	@Autowired
	ZuordnungService zuordnungService;
	
	public void saveTemplate(Template template) {
		
		if (template.getId() == 0  ) {
			templateRepository.save(template);
			planService.createPlansfromTemplate(template);
		}
		else {
			int templateid = template.getId();
			template.setId(0);
			
			Template templateOrig = templateRepository.findById(templateid).get();
			
			if (template.getGueltigVon().isBefore(templateOrig.getGueltigVon()) 
					|| isBefore(template.getGueltigBis(),templateOrig.getGueltigBis()) ) {
				renewTemplate(templateOrig,template,templateOrig.getGueltigVon());
			}
			else if (isBefore(template.getGueltigVon(),templateOrig.getGueltigBis())) {
				renewTemplate(templateOrig,template,template.getGueltigVon());
			}
			else {
				template.setId(0);
				templateRepository.save(template);
				planService.createPlansfromTemplate(template);
				templateOrig.setNext(template.getId());
				templateRepository.save(templateOrig);
			}
		}
	}

	private void renewTemplate(Template templateOrig, Template template, LocalDate changeDate) {
		templateRepository.save(template);
		templateOrig.setGueltigBis(template.getGueltigVon());
		templateOrig.setNext(template.getId());
		templateRepository.save(templateOrig);

		List<Plan> deactivatedPlans = planService.deactivatePlans(templateOrig);
		planService.createPlansfromTemplate(template);

		List<BuchungsBeleg> belege = zuordnungService.deleteDeactivated(deactivatedPlans);		
		zuordnungService.assign(belege);
	}

	private boolean isBefore(LocalDate gueltigBis, LocalDate gueltigBisOrig) {
		
		if (gueltigBis == null && gueltigBisOrig == null)
			return false;
		else if (gueltigBis == null && gueltigBisOrig != null) 
			return false;
		else if (gueltigBis == null && gueltigBisOrig == null)
			return true;
		else
			return gueltigBis.isBefore(gueltigBisOrig);
	}

	public Template createFromBeleg(Integer id) {
		Optional<BuchungsBeleg> beleg = buchungsBelegRepository.findById(id);
		if (beleg.isPresent()) {
			Konto konto =  kontoRepository.findById(KONTO_DEFAULT).get();
			Template template = new Template(beleg.get());
			template.setKonto(konto);
			return  template;
		}
		return new Template();
	}
}
