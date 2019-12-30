package loc.balsen.kontospring.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import loc.balsen.kontospring.data.SubCategory;
import loc.balsen.kontospring.data.Category;
import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.Template;
import loc.balsen.kontospring.dto.EnumDTO;
import loc.balsen.kontospring.repositories.CategoryRepository;
import loc.balsen.kontospring.repositories.SubCategoryRepository;

@Component
@RequestMapping("/collections")
public class CollectionsController {

	@GetMapping("/matchstyle")
	@ResponseBody
	List<EnumDTO> findPlanArtEnum() {
		List<EnumDTO> list = new ArrayList<>();
		list.add(new EnumDTO("Genau", Plan.MatchStyle.EXACT.ordinal()));
		list.add(new EnumDTO("Maximal", Plan.MatchStyle.MAX.ordinal()));
		list.add(new EnumDTO("Max Summe", Plan.MatchStyle.SUMMAX.ordinal()));
		list.add(new EnumDTO("Muster", Plan.MatchStyle.PATTERN.ordinal()));
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
