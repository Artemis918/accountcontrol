package loc.balsen.kontospring.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.Plan.MatchStyle;
import loc.balsen.kontospring.dataservice.PlanService;
import loc.balsen.kontospring.dto.MessageID;
import loc.balsen.kontospring.dto.PlanDTO;
import loc.balsen.kontospring.repositories.PlanRepository;
import loc.balsen.kontospring.repositories.SubCategoryRepository;
import loc.balsen.kontospring.repositories.TemplateRepository;

@Controller
@RequestMapping("/plans")
@ResponseBody
public class PlanController {

	@Autowired
	private PlanRepository planRepository;

	@Autowired
	private SubCategoryRepository subCategoryRepository;

	@Autowired
	private TemplateRepository templateRepository;

	@Autowired
	private PlanService planService;

	@GetMapping("/list/{year}/{month}")
	List<PlanDTO> findPlans(@PathVariable Integer year, @PathVariable Integer month) {
		LocalDate start = LocalDate.of(year, month, 1);
		LocalDate end = LocalDate.of(year, month, start.lengthOfMonth());

		return planRepository.findByPlanDate(start, end).stream().map((plan) -> {
			return new PlanDTO(plan);
		}).collect(Collectors.toList());
	}

	@GetMapping("/unassigned/{year}/{month}")
	List<PlanDTO> findUnassignedPlans(@PathVariable Integer year, @PathVariable Integer month) {
		LocalDate start = LocalDate.of(year, month, 1);
		LocalDate end = LocalDate.of(year, month, start.lengthOfMonth());

		return planRepository.findByPlanDateNotAssigned(start, end).stream().filter((plan) -> {
			return plan.getMatchStyle() != MatchStyle.PATTERN && plan.getMatchStyle() != MatchStyle.SUMMAX;
		}).map((plan) -> {
			return new PlanDTO(plan);
		}).collect(Collectors.toList());
	}

	@GetMapping("/patternplans/{categoryid}")
	List<PlanDTO> findPatternPlans(@PathVariable Integer categoryid) {

		return planRepository.findByPatternPlansAndCategory(categoryid).stream().map((plan) -> {
			return new PlanDTO(plan);
		}).collect(Collectors.toList());
	}

	@PostMapping("/save")
	MessageID savePlan(@RequestBody PlanDTO plandto) {
		Plan plan = plandto.toPlan(templateRepository, subCategoryRepository);
		plan.setCreationDate(LocalDate.now());
		planRepository.save(plan);
		return MessageID.ok;
	}

	@PostMapping("/savePattern")
	MessageID savePattern(@RequestBody PlanDTO plandto) {
		Plan plan = plandto.toPlan(templateRepository, subCategoryRepository);
		plan.setCreationDate(LocalDate.now());
		plan.setMatchStylePattern();
		planRepository.save(plan);
		return MessageID.ok;
	}

	@GetMapping("/id/{id}")
	PlanDTO findPlan(@PathVariable Integer id) {
		Optional<Plan> plan = planRepository.findById(id);
		if (plan.isPresent()) {
			return (new PlanDTO(plan.get()));
		} else {
			return null;
		}
	}

	@GetMapping("/delete/{id}")
	MessageID deletePlan(@PathVariable Integer id) {
		Plan plan = planRepository.findById(id).get();
		planService.deactivatePlan(plan);
		return MessageID.ok;
	}

	@GetMapping("createFromTemplates/{month}/{year}")
	MessageID createFromTemplates(@PathVariable Integer month, @PathVariable Integer year) {
		planService.createPlansfromTemplatesUntil(month, year);
		return MessageID.ok;
	}
}
