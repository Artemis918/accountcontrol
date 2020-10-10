package loc.balsen.kontospring.dataservice;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import loc.balsen.kontospring.data.AccountRecord;
import loc.balsen.kontospring.data.Pattern;
import loc.balsen.kontospring.data.SubCategory;
import loc.balsen.kontospring.data.Plan.MatchStyle;
import loc.balsen.kontospring.data.Template;
import loc.balsen.kontospring.repositories.AccountRecordRepository;
import loc.balsen.kontospring.repositories.SubCategoryRepository;
import loc.balsen.kontospring.repositories.TemplateRepository;

@Component
public class TemplateService {

	private static final int SUBCATEGORY_DEFAULT = 1;

	PlanService planService;
	TemplateRepository templateRepository;
	AccountRecordRepository accountRecordRepository;
	SubCategoryRepository subCategoryRepository;

	@Autowired
	public TemplateService(PlanService planService, TemplateRepository templateRepository,
			AccountRecordRepository accountRecordRepository, SubCategoryRepository subCategoryRepository) {
		this.planService = planService;
		this.templateRepository = templateRepository;
		this.accountRecordRepository = accountRecordRepository;
		this.subCategoryRepository = subCategoryRepository;
	}

	public void replaceTimeRange(Template temp, LocalDate from, LocalDate newStartDate, int newVariance) {
		temp.setStart(newStartDate);
		temp.setVariance(newVariance);
		templateRepository.save(temp);
		planService.replaceTimeRange(temp, from, newStartDate, newVariance);
	}

	public void replacePattern(Template temp, LocalDate from, Pattern newPattern) {
		temp.setPattern(newPattern);
		templateRepository.save(temp);
		planService.replacePattern(temp, from, newPattern);
	}

	public void saveTemplate(Template template) {

		if (template.getId() == 0) {
			templateRepository.save(template);
			planService.createPlansfromTemplate(template);
		} else if (template.getMatchStyle() == MatchStyle.PATTERN) {
			templateRepository.save(template);
		} else {
			Template templateOrig = templateRepository.findById(template.getId()).get();

			if (templateOrig.equalsExceptValidPeriod(template)) {
				templateOrig.setValidUntil(template.getValidUntil());
			} else {
				LocalDate changeDay = template.getValidFrom();

				template.setId(0);
				template.setValidFrom(changeDay);
				templateRepository.save(template);
				planService.createPlansfromTemplate(template);

				templateOrig.setValidUntil(changeDay.minusDays(1));
				templateOrig.setNext(template.getId());
			}
			templateRepository.save(templateOrig);
			planService.deactivatePlans(templateOrig);
		}
	}

	public Template createFromRecord(Integer id) {
		Optional<AccountRecord> record = accountRecordRepository.findById(id);
		if (record.isPresent()) {
			SubCategory subCategory = subCategoryRepository.findById(SUBCATEGORY_DEFAULT).get();
			Template template = new Template(record.get());
			template.setSubCategory(subCategory);
			return template;
		}
		return new Template();
	}

	public void deleteTemplate(Template template) {
		planService.detachPlans(template);
		templateRepository.delete(template);
	}

	public void replaceTemplate(Template template, Template template2) {
		// TODO Auto-generated method stub.	
	}
}
