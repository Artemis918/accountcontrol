package loc.balsen.kontospring.controller;

import java.time.LocalDate;
import java.util.ArrayList;
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
@ResponseBody
public class StatsController {
	
	private StatsService statistikService;
	
	@Autowired
	public StatsController(StatsService statistikService) {
		this.statistikService = statistikService;
	}
	
	@Data 
	class StatsDTO {
		List<StatsMonthDTO> data;
		int min;
		int max;
		public StatsDTO(List<StatsMonthDTO> d, int min, int max) { data=d; this.min=min;this.max = max;}
	}
	
	@Data
	class StatsMonthDTO {
		LocalDate day;
		int value;
		int planvalue;
		int forecast;
		
		public StatsMonthDTO(LocalDate d, int v, int p, int f) { day = d; value =v; planvalue = p; forecast = f; }
	}
	
	@GetMapping("/real/{startyear}/{startmonth}/{endyear}/{endmonth}")
	public StatsDTO getReal(@PathVariable Integer startyear, @PathVariable Integer startmonth, @PathVariable Integer endyear, @PathVariable Integer endmonth) {
		LocalDate curDate = LocalDate.of(startyear, startmonth, 1);
		LocalDate endDate = LocalDate.of(endyear, endmonth, 28);
		
		List<Integer> monthlyValues = statistikService.getMonthlyCumulatedAssigns(curDate, endDate);
		List<Integer> monthlyPlanValues = statistikService.getMonthlyCumulatedPlan(curDate, endDate);

		List<StatsMonthDTO> result = new ArrayList<>();

		int maxval = monthlyValues.stream().max(Integer::compare).get();
		int maxplan = monthlyPlanValues.stream().max(Integer::compare).get();
		int minval = monthlyValues.stream().min(Integer::compare).get();
		int minplan = monthlyPlanValues.stream().min(Integer::compare).get();
		
		int beginforecast = monthlyValues.size()-1;
		int diffval = 0;
		
		while (beginforecast > 0 && monthlyValues.get(beginforecast).equals(monthlyValues.get(beginforecast-1)))
			beginforecast--;
		
		for (int i = 0; i< monthlyValues.size() ; i++) {
			int planval = monthlyPlanValues.get(i);
			int val = monthlyValues.get(i);
			
			if (i < beginforecast-1) {
				result.add(new StatsMonthDTO(curDate, val, planval, 0));
			}
			else if ( beginforecast == 0 || i == beginforecast-1) {
				diffval = val -planval;
				result.add(new StatsMonthDTO(curDate, val, planval, val));
			}
			else if ( beginforecast !=0 && i== beginforecast) {
				result.add(new StatsMonthDTO(curDate, val, planval, planval+diffval));
			}
			else {
				result.add(new StatsMonthDTO(curDate, 0, planval, planval+diffval));
			}
			curDate = curDate.plusMonths(1);
		}
		return new StatsDTO(result, Math.min(minplan, minval), Math.max(maxplan, maxval));
	}
}
