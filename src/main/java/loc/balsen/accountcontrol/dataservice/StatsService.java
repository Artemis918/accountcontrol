package loc.balsen.accountcontrol.dataservice;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.ListIterator;
import java.util.function.Function;
import java.util.function.ToIntFunction;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;
import loc.balsen.accountcontrol.data.Assignment;
import loc.balsen.accountcontrol.data.Category;
import loc.balsen.accountcontrol.data.Plan;
import loc.balsen.accountcontrol.repositories.AssignmentRepository;
import loc.balsen.accountcontrol.repositories.PlanRepository;


@Component
public class StatsService {

  private AssignmentRepository assignmentRepository;
  private PlanRepository planRepository;

  public StatsService(AssignmentRepository assignmentRepository, PlanRepository planRepository) {
    this.assignmentRepository = assignmentRepository;
    this.planRepository = planRepository;
  }


  public List<Integer> getMonthlyAssigns(LocalDate startDay, LocalDate endDay, boolean cumulated) {
    List<Assignment> list = getAssignments(startDay, endDay);
    return this.<Assignment>getMonthly(list, startDay, endDay, cumulated, Assignment::getStatsDay,
        Assignment::getValue);
  }

  public List<Integer> getMonthlyAssigns(LocalDate startDay, LocalDate endDay, boolean cumulated,
      Category category) {

    List<Assignment> list = getAssignments(startDay, endDay).stream().filter((Assignment a) -> {
      return a.getSubCategory().getCategory() == category;
    }).collect(Collectors.toList());

    return this.<Assignment>getMonthly(list, startDay, endDay, cumulated, Assignment::getStatsDay,
        Assignment::getValue);
  }


  public List<Integer> getMonthlyPlan(LocalDate startDay, LocalDate endDay, boolean cumulated) {
    List<Plan> list = planRepository.findByPlanDate(startDay, endDay);
    return this.<Plan>getMonthly(list, startDay, endDay, cumulated, Plan::getPlanDate,
        Plan::getValue);
  }

  public List<Integer> getMonthlyPlan(LocalDate startDay, LocalDate endDay, boolean cumulated,
      Category category) {

    List<Plan> list = planRepository.findByPlanDate(startDay, endDay).stream().filter((Plan p) -> {
      return p.getSubCategory().getCategory() == category;
    }).collect(Collectors.toList());

    return this.<Plan>getMonthly(list, startDay, endDay, cumulated, Plan::getPlanDate,
        Plan::getValue);
  }


  private List<Assignment> getAssignments(LocalDate start, LocalDate end) {

    List<Assignment> resultlist = new ArrayList<Assignment>();

    List<Assignment> planned = assignmentRepository.findAllPlannedByPeriod(start, end);
    List<Assignment> unplanned = assignmentRepository.findAllNotPlannedByPeriod(start, end);

    ListIterator<Assignment> piter = planned.listIterator();
    ListIterator<Assignment> uiter = unplanned.listIterator();

    while (piter.hasNext() && uiter.hasNext()) {

      Assignment plan = piter.next();
      Assignment record = uiter.next();

      if (plan.getPlan().getPlanDate().isBefore(record.getAccountrecord().getExecuted())) {
        resultlist.add(plan);
        uiter.previous();
      } else {
        piter.previous();
        resultlist.add(record);
      }
    }

    while (uiter.hasNext())
      resultlist.add(uiter.next());

    while (piter.hasNext())
      resultlist.add(piter.next());

    return resultlist;
  }

  private <T> List<Integer> getMonthly(List<T> list, LocalDate start, LocalDate end,
      boolean cumulated, Function<T, LocalDate> getDate, ToIntFunction<T> getValue) {
    LocalDate curDate = start;

    List<Integer> result = new ArrayList<>();
    int sum = 0;

    for (T obj : list) {
      LocalDate date = getDate.apply(obj);

      while (date.getMonth() != curDate.getMonth() || date.getYear() != curDate.getYear()) {
        result.add(Integer.valueOf(sum));
        curDate = curDate.plusMonths(1);
        if (!cumulated) {
          sum = 0;
        }
      }

      sum += getValue.applyAsInt(obj);
    }

    while (curDate.isBefore(end) || curDate.isEqual(end)) {
      result.add(Integer.valueOf(sum));
      if (!cumulated) {
        sum = 0;
      }
      curDate = curDate.plusMonths(1);
    }

    return result;

  }

}
