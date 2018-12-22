package loc.balsen.kontospring.controller;

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
import loc.balsen.kontospring.dataservice.PlanService;
import loc.balsen.kontospring.dto.PlanDTO;
import loc.balsen.kontospring.repositories.PlanRepository;

@Controller
@RequestMapping("/plans")
public class PlanController {
		
	@Autowired
	private PlanRepository planRepository;

	@Autowired
	private PlanService planService;
	
	@GetMapping("/list")
	@ResponseBody
	List<PlanDTO> findTemplates() {
		return planRepository.findAll()
				.stream()
				.map((plan) -> {return new PlanDTO(plan);})
				.collect(Collectors.toList());
	}
	
	@PostMapping("/save")
	@ResponseBody
	KontoSpringResult savePlan(@RequestBody PlanDTO plan) {
		planRepository.save(plan.toPlan());
		return new KontoSpringResult(false,"Gespeichert");
	}
	
	@GetMapping("/id/{id}")
	@ResponseBody
	PlanDTO findPlan(@PathVariable Integer id) {
		Optional<Plan> plan = planRepository.findById(id);
		if (plan.isPresent()) {
			return (new PlanDTO(plan.get()));
		}
		else {
			return null;
		}
	}
	
	@GetMapping("/delete/{id}")
	@ResponseBody
	KontoSpringResult deletePlan(@PathVariable Integer id) {
		planRepository.deleteById(id);
		return new KontoSpringResult(false,"gelöscht");
	}
	
	@GetMapping("createFromTemplate/{month}/{year}")
	@ResponseBody
	KontoSpringResult createFromTemplates(@PathVariable Integer month, @PathVariable Integer year) {
		planService.createPlansfromTemplatesUntil(month, year);
		return new KontoSpringResult(false,"erzeugt");
	}
}
