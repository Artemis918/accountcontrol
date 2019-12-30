package loc.balsen.kontospring.dataservice;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import loc.balsen.kontospring.data.BuchungsBeleg;
import loc.balsen.kontospring.data.SubCategory;
import loc.balsen.kontospring.data.Plan.MatchStyle;
import loc.balsen.kontospring.data.Template;
import loc.balsen.kontospring.repositories.BuchungsBelegRepository;
import loc.balsen.kontospring.repositories.SubCategoryRepository;
import loc.balsen.kontospring.repositories.TemplateRepository;

@Component
public class TemplateService {

	private static final int KONTO_DEFAULT = 1;

	PlanService planService;
	TemplateRepository templateRepository;
	BuchungsBelegRepository buchungsBelegRepository;
	SubCategoryRepository subCategoryRepository;
	
	@Autowired
	public TemplateService(PlanService planService,
			               TemplateRepository templateRepository,
			               BuchungsBelegRepository buchungsBelegRepository,
			               SubCategoryRepository kontoRepository) {
		this.planService = planService;
		this.templateRepository = templateRepository;
		this.buchungsBelegRepository = buchungsBelegRepository;
		this.subCategoryRepository = kontoRepository;
	}

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
				templateOrig.setValidUntil(template.getValidUntil());
				template = templateOrig;
			} else {
				LocalDate lastPlan = planService.getLastPlanOf(templateOrig);
				LocalDate changeDay = template.getValidFrom();
				if (lastPlan.isAfter(changeDay))
					changeDay=lastPlan.plusDays(1);
				
				template.setId(0);
				
				template.setValidFrom(changeDay);
				if (template.getValidUntil() != null && template.getValidUntil().isBefore(changeDay))
					template.setValidUntil(changeDay);
					
				templateRepository.save(template);
				
				templateOrig.setValidUntil(changeDay.minusDays(1));
				templateOrig.setNext(template.getId());
			}
			templateRepository.save(templateOrig);
			planService.deactivatePlans(templateOrig);
			
			planService.createNewPlansfromTemplate(template);

		}
	}
	
	public Template createFromBeleg(Integer id) {
		Optional<BuchungsBeleg> beleg = buchungsBelegRepository.findById(id);
		if (beleg.isPresent()) {
			SubCategory subCategory = subCategoryRepository.findById(KONTO_DEFAULT).get();
			Template template = new Template(beleg.get());
			template.setSubCategory(subCategory);
			return template;
		}
		return new Template();
	}
	
	public void deleteTemplate(Template template) {
		planService.detachPlans(template);
		templateRepository.delete(template);
	}
}
