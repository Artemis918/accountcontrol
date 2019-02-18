package loc.balsen.kontospring.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import loc.balsen.kontospring.dataservice.StatsService;
import lombok.Data;

@Controller
@RequestMapping("/stats")
public class StatsController {
	
	private StatsService statistikService;
	
	@Autowired
	public StatsController(StatsService statistikService) {
		this.statistikService = statistikService;
	}
	
	@Data
	class StatsMonthDTO {
		LocalDate day;
		int value;
		int planvalue;
		
		public StatsMonthDTO(LocalDate d, int v, int p) { day = d; value =v; planvalue = p; }
	}
	
	@GetMapping("/real/{startyear}/{startmonth}")
	@ResponseBody
	public List<StatsMonthDTO> getReal(@PathVariable Integer startyear, @PathVariable Integer startmonth) {
		LocalDate start = LocalDate.of(startyear, startmonth, 1);
		
		List<Integer> monthlyValues = statistikService.getMonthlyCumulatedAssigns(start);
		List<Integer> monthlyPlanValues = statistikService.getMonthlyCumulatedPlan(start);

		List<StatsMonthDTO> result = new ArrayList<>();
		Iterator<Integer> planiter = monthlyPlanValues.iterator();
		for (Integer val: monthlyValues) {
			result.add(new StatsMonthDTO(start, val, planiter.next()));
			start = start.plusMonths(1);
		}
		return result;
	}

}
