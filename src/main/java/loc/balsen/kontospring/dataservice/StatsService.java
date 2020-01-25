package loc.balsen.kontospring.dataservice;

import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.ListIterator;
import java.util.function.Function;
import java.util.function.ToIntFunction;

import org.springframework.stereotype.Component;

import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.Assignment;
import loc.balsen.kontospring.repositories.PlanRepository;
import loc.balsen.kontospring.repositories.AssignmentRepository;


@Component
public class StatsService {

	private AssignmentRepository assignmentRepository;
	private PlanRepository planRepository;

	public StatsService(AssignmentRepository assignmentRepository, PlanRepository planRepository) {
		this.assignmentRepository = assignmentRepository;
		this.planRepository = planRepository;
	}

	public List<Integer> getMonthlyCumulatedAssigns(LocalDate start) {
		return getMonthlyCumulatedAssigns(start, LocalDate.now());
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

	public List<Integer> getMonthlyCumulatedPlan(LocalDate start) {
		return getMonthlyCumulatedPlan(start, LocalDate.now());
	}

	
	private <T> List<Integer> getMonthlyCumulated (List<T> list, LocalDate start, LocalDate end, Function<T,LocalDate> getDate, ToIntFunction<T> getValue) {
		LocalDate curDate = start;

		List<Integer> result = new ArrayList<>();
		int sum = 0;

		for (T obj : list) {
			LocalDate date = getDate.apply(obj);

			while (date.getMonth() != curDate.getMonth() || date.getYear() != curDate.getYear()) {
				result.add(new Integer(sum));
				curDate = curDate.plusMonths(1);
			}

			sum += getValue.applyAsInt(obj);
		}

		while (curDate.isBefore(end)) {
			result.add(new Integer(sum));
			curDate = curDate.plusMonths(1);
		}

		return result;
		
	}
	
	public List<Integer> getMonthlyCumulatedAssigns(LocalDate start, LocalDate end) {
		LocalDate startDay = start.with(TemporalAdjusters.firstDayOfMonth());
		LocalDate endDay = end.with(TemporalAdjusters.lastDayOfMonth());
		List<Assignment> list = getAssignments(startDay, endDay);
		return this.<Assignment>getMonthlyCumulated(list , startDay, endDay, Assignment::getStatsDay, Assignment::getValue);
	}
	
	public List<Integer> getMonthlyCumulatedPlan(LocalDate start, LocalDate end) {
		LocalDate startDay = start.with(TemporalAdjusters.firstDayOfMonth());
		LocalDate endDay = end.with(TemporalAdjusters.lastDayOfMonth());
		List<Plan> list = planRepository.findByPlanDate(startDay, endDay);
		return this.<Plan>getMonthlyCumulated(list , startDay, endDay, Plan::getPlanDate, Plan::getValue);
	}
	
	public List<Integer> getMonthlyCumulatedAssignsOld(LocalDate start, LocalDate end) {

		LocalDate startDay = start.with(TemporalAdjusters.firstDayOfMonth());
		LocalDate endDay = end.with(TemporalAdjusters.lastDayOfMonth());
		LocalDate curDate = startDay;

		List<Integer> result = new ArrayList<>();
		int sum = 0;

		for (Assignment assignment : getAssignments(startDay, endDay)) {
			LocalDate date = assignment.getStatsDay();

			while (date.getMonth() != curDate.getMonth() || date.getYear() != curDate.getYear()) {
				result.add(new Integer(sum));
				curDate = curDate.plusMonths(1);
			}

			sum += assignment.getValue();
		}

		while (curDate.isBefore(endDay)) {
			result.add(new Integer(sum));
			curDate = curDate.plusMonths(1);
		}

		return result;
	}

	public List<Integer> getMonthlyCumulatedPlanOld(LocalDate start, LocalDate end) {

		LocalDate startDay = start.with(TemporalAdjusters.firstDayOfMonth());
		LocalDate endDay = end.with(TemporalAdjusters.lastDayOfMonth());

		List<Integer> result = new ArrayList<>();
		LocalDate curDate = start;
		int sum = 0;

		for (Plan plan : planRepository.findByPlanDate(startDay, endDay)) {
			LocalDate date = plan.getPlanDate();
			while (date.getMonth() != curDate.getMonth() || date.getYear() != curDate.getYear()) {
				result.add(new Integer(sum));
				curDate = curDate.plusMonths(1);
			}
			sum += plan.getValue();
		}
		while (curDate.isBefore(endDay)) {
			result.add(new Integer(sum));
			curDate = curDate.plusMonths(1);
		}
		return result;
	}

}
