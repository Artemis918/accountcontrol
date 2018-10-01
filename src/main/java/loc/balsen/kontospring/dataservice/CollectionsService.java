package loc.balsen.kontospring.dataservice;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.Template;

@Component
@RequestMapping("/collections")
public class CollectionsService {
	
	@GetMapping("/planart")
	@ResponseBody
	List<EnumDTO> findPlanArtEnum() {
		List<EnumDTO> list = new ArrayList<>();
		list.add(new EnumDTO("Genau", Plan.Art.EXACT.ordinal()));
		list.add(new EnumDTO("Maximal", Plan.Art.MAX.ordinal()));
		list.add(new EnumDTO("Max Summe", Plan.Art.SUMMAX.ordinal()));
		list.add(new EnumDTO("Muster", Plan.Art.PATTERN.ordinal()));
		return list;
	}

	@GetMapping("/rythmus")
	@ResponseBody
	List<EnumDTO> findRythmusEnum() {
		List<EnumDTO> list = new ArrayList<>();
		list.add(new EnumDTO("Tag", Template.Rythmus.DAY.ordinal()));
		list.add(new EnumDTO("Woche", Template.Rythmus.WEEK.ordinal()));
		list.add(new EnumDTO("Monat", Template.Rythmus.MONTH.ordinal()));
		list.add(new EnumDTO("Jahr", Template.Rythmus.YEAR.ordinal()));
		return list;
	}
}
