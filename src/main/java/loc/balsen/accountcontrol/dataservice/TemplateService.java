package loc.balsen.accountcontrol.dataservice;

import java.time.LocalDate;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import loc.balsen.accountcontrol.data.AccountRecord;
import loc.balsen.accountcontrol.data.Pattern;
import loc.balsen.accountcontrol.data.Plan.MatchStyle;
import loc.balsen.accountcontrol.data.SubCategory;
import loc.balsen.accountcontrol.data.Template;
import loc.balsen.accountcontrol.data.Template.TimeUnit;
import loc.balsen.accountcontrol.repositories.AccountRecordRepository;
import loc.balsen.accountcontrol.repositories.SubCategoryRepository;
import loc.balsen.accountcontrol.repositories.TemplateRepository;

@Component
public class TemplateService {

  private static final int SUBCATEGORY_DEFAULT = 1;

  PlanService planService;
  TemplateRepository templateRepository;
  AccountRecordRepository accountRecordRepository;
  SubCategoryRepository subCategoryRepository;

  @Autowired
  public TemplateService(PlanService planService, TemplateRepository templateRepository,
      AccountRecordRepository accountRecordRepository,
      SubCategoryRepository subCategoryRepository) {
    this.planService = planService;
    this.templateRepository = templateRepository;
    this.accountRecordRepository = accountRecordRepository;
    this.subCategoryRepository = subCategoryRepository;
  }

  public void replaceTimeRange(Template temp, LocalDate from, LocalDate newStartDate,
      int newVariance) {
    temp.setTimeRange(newStartDate, newVariance);
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
    } else {
      Template templateOrig = templateRepository.findById(template.getId()).get();

      if (templateOrig.equalsExceptValidPeriod(template)) {
        templateOrig.setValidUntil(template.getValidUntil());
      } else {
        LocalDate changeDay = template.getValidFrom();

        if (changeDay.equals(templateOrig.getValidFrom())) {
          LocalDate lastDayUsed = planService.getLastAssignedPlanOf(templateOrig);
          if (lastDayUsed != null) {
            changeDay = lastDayUsed.plusDays(1);
          }
        }

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
      Template template = new Template(record.get(), subCategory);
      return template;
    }
    return new Template(0, null, null, null, 4, 0, TimeUnit.MONTH, null, 0, 0, null, null, null,
        MatchStyle.EXACT, 0);
  }

  public void deleteTemplate(Template template) {
    planService.detachPlans(template);
    templateRepository.delete(template);
  }

  public void replaceTemplate(Template template, Template template2) {
    // TODO replace template in all newer plans with new dates
  }
}
