package loc.balsen.accountcontrol.dataservice;

import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import loc.balsen.accountcontrol.data.Pattern;
import loc.balsen.accountcontrol.data.Plan;
import loc.balsen.accountcontrol.data.Template;
import loc.balsen.accountcontrol.repositories.PlanRepository;
import loc.balsen.accountcontrol.repositories.TemplateRepository;

@Component
public class PlanService {

  private TemplateRepository templateRepository;
  private PlanRepository planRepository;

  @Autowired
  public PlanService(PlanRepository planRepository, TemplateRepository templateRepository) {
    this.planRepository = planRepository;
    this.templateRepository = templateRepository;
  }

  public void createPlansfromTemplatesUntil(int month, int year) {

    LocalDate last = planRepository.findMaxPlanDate();
    if (last != null && last.getMonth().getValue() == month && last.getYear() == year)
      return;

    final LocalDate end = LocalDate.of(year, month, 1).with(TemporalAdjusters.lastDayOfMonth());
    final LocalDate start =
        (last != null) ? last.plusMonths(1).with(TemporalAdjusters.firstDayOfMonth()) : null;

    List<Template> templates = templateRepository.findAll();
    templates.stream().filter((t) -> isTemplateRange(t, start, end)).forEach((t) -> createPlans(t,
        t.getValidFrom(), (start != null) ? start.minusDays(1) : t.getValidFrom(), end));
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
    createPlansfromTemplate(template, excludeFrom, excludeUntil);
  }

  private void createPlansfromTemplate(Template template, LocalDate excludeFrom,
      LocalDate excludeUntil) {

    LocalDate end = planRepository.findMaxPlanDate();
    if (end == null)
      end = LocalDate.now();
    end = end.with(TemporalAdjusters.lastDayOfMonth());

    createPlans(template, excludeFrom, excludeUntil, end);
  }

  private void createPlans(Template template, LocalDate excludeFrom, LocalDate excludeUntil,
      LocalDate end) {

    for (LocalDate nextDate = template.getStart(); !nextDate.isAfter(end); nextDate =
        template.increaseDate(nextDate)) {

      if (nextDate.isBefore(template.getValidFrom()))
        continue;

      if (excludeFrom != null && excludeUntil != null
          && !(nextDate.isBefore(excludeFrom) || nextDate.isAfter(excludeUntil)))
        continue;

      if (template.getValidUntil() != null && nextDate.isAfter(template.getValidUntil()))
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
    p.deactivate();
    planRepository.save(p);
  }

  public void detachPlans(Template template) {
    planRepository.findByTemplate(template).forEach((p) -> {
      p.removeTemplate();
      planRepository.save(p);
    });
  }

  public void replacePattern(Template template, LocalDate from, Pattern newPattern) {
    List<Plan> plans = planRepository.findByTemplate(template);
    plans.stream().filter((p) -> {
      return !p.getPlanDate().isBefore(from);
    }).forEach((p) -> {
      p.setPattern(newPattern);
      planRepository.save(p);
    });
  }

  public void replaceTimeRange(Template template, LocalDate from, LocalDate newPlanDate,
      int newVariance) {
    List<Plan> plans = planRepository.findByTemplate(template);
    plans.stream().filter((p) -> {
      return !p.getPlanDate().isBefore(from);
    }).forEach((p) -> {
      p.setDates(newPlanDate, newVariance);
      planRepository.save(p);
    });
  }

  private boolean isTemplateRange(Template template, LocalDate start, LocalDate end) {
    if ((start == null || template.getValidFrom().isBefore(start))
        && (template.getValidUntil() == null
            || (start == null || !template.getValidUntil().isBefore(start)))) {
      return true;
    } else if (!template.getValidFrom().isAfter(end)) {
      return true;
    } else
      return false;
  }

}
