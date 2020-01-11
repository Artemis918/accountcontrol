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
import loc.balsen.kontospring.data.Zuordnung;
import loc.balsen.kontospring.repositories.PlanRepository;
import loc.balsen.kontospring.repositories.ZuordnungRepository;


@Component
public class StatsService {

	private ZuordnungRepository zuordnungRepository;
	private PlanRepository planRepository;

	public StatsService(ZuordnungRepository zuordnungRepository, PlanRepository planRepository) {
		this.zuordnungRepository = zuordnungRepository;
		this.planRepository = planRepository;
	}

	public List<Integer> getMonthlyCumulatedAssigns(LocalDate start) {
		return getMonthlyCumulatedAssigns(start, LocalDate.now());
	}

	private List<Zuordnung> getZuordnungen(LocalDate start, LocalDate end) {

		List<Zuordnung> resultlist = new ArrayList<Zuordnung>();

		List<Zuordnung> planned = zuordnungRepository.findAllPlannedByPeriod(start, end);
		List<Zuordnung> unplanned = zuordnungRepository.findAllNotPlannedByPeriod(start, end);

		ListIterator<Zuordnung> piter = planned.listIterator();
		ListIterator<Zuordnung> uiter = unplanned.listIterator();

		while (piter.hasNext() && uiter.hasNext()) {

			Zuordnung plan = piter.next();
			Zuordnung record = uiter.next();

			if (plan.getPlan().getPlanDate().isBefore(record.getAccountrecord().getWertstellung())) {
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

	
	private <T> List<Integer> getMonthlyCumulated (List<T> list, LocalDate start, LocalDate end, Function<T,LocalDate> getDate, ToIntFunction<T> getWert) {
		LocalDate curDate = start;

		List<Integer> result = new ArrayList<>();
		int sum = 0;

		for (T obj : list) {
			LocalDate date = getDate.apply(obj);

			while (date.getMonth() != curDate.getMonth() || date.getYear() != curDate.getYear()) {
				result.add(new Integer(sum));
				curDate = curDate.plusMonths(1);
			}

			sum += getWert.applyAsInt(obj);
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
		List<Zuordnung> list = getZuordnungen(startDay, endDay);
		return this.<Zuordnung>getMonthlyCumulated(list , startDay, endDay, Zuordnung::getStatsDay, Zuordnung::getWert);
	}
	
	public List<Integer> getMonthlyCumulatedPlan(LocalDate start, LocalDate end) {
		LocalDate startDay = start.with(TemporalAdjusters.firstDayOfMonth());
		LocalDate endDay = end.with(TemporalAdjusters.lastDayOfMonth());
		List<Plan> list = planRepository.findByPlanDate(startDay, endDay);
		return this.<Plan>getMonthlyCumulated(list , startDay, endDay, Plan::getPlanDate, Plan::getWert);
	}
	
	public List<Integer> getMonthlyCumulatedAssignsOld(LocalDate start, LocalDate end) {

		LocalDate startDay = start.with(TemporalAdjusters.firstDayOfMonth());
		LocalDate endDay = end.with(TemporalAdjusters.lastDayOfMonth());
		LocalDate curDate = startDay;

		List<Integer> result = new ArrayList<>();
		int sum = 0;

		for (Zuordnung zuordnung : getZuordnungen(startDay, endDay)) {
			LocalDate date = zuordnung.getStatsDay();

			while (date.getMonth() != curDate.getMonth() || date.getYear() != curDate.getYear()) {
				result.add(new Integer(sum));
				curDate = curDate.plusMonths(1);
			}

			sum += zuordnung.getWert();
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
			sum += plan.getWert();
		}
		while (curDate.isBefore(endDay)) {
			result.add(new Integer(sum));
			curDate = curDate.plusMonths(1);
		}
		return result;
	}

}
