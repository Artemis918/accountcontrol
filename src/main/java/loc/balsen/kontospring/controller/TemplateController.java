package loc.balsen.kontospring.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
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
import loc.balsen.kontospring.data.Template;
import loc.balsen.kontospring.dataservice.TemplateService;
import loc.balsen.kontospring.dto.MessageID;
import loc.balsen.kontospring.dto.TemplateDTO;
import loc.balsen.kontospring.repositories.PlanRepository;
import loc.balsen.kontospring.repositories.SubCategoryRepository;
import loc.balsen.kontospring.repositories.TemplateRepository;

@Controller
@RequestMapping("/templates")
@ResponseBody
public class TemplateController {

	@Autowired
	TemplateRepository templateRepository;

	@Autowired
	PlanRepository planRepository;
	
	@Autowired
	SubCategoryRepository subcategoryRepository;

	@Autowired
	TemplateService templateService;

	@GetMapping("/listcategory/{category}")
	List<TemplateDTO> findGroupTemplates(@PathVariable int category) {
		return templateRepository.findValid().stream().filter((template) -> {
			return template.getSubCategory().getCategory().getId() == category;
		}).map((template) -> {
			return new TemplateDTO(template);
		}).collect(Collectors.toList());
	}

	@PostMapping("/save")
	MessageID saveTemplate(@RequestBody TemplateDTO template) {
		templateService.saveTemplate(template.toTemplate(subcategoryRepository));
		return MessageID.ok;
	}

	@GetMapping("/delete/{id}")
	MessageID deleteTemplate(@PathVariable Integer id) {
		Optional<Template> template = templateRepository.findById(id);
		if (template.isPresent()) 
			templateService.deleteTemplate(template.get());;
		return MessageID.ok;
	}

	@GetMapping("/accountrecord/{id}")
	TemplateDTO createTemplateFromRecord(@PathVariable Integer id) {
		return new TemplateDTO(templateService.createFromRecord(id));
	}
	
	@GetMapping("/changevalue/{templateId}/{value}")
	MessageID changeplan(@PathVariable Integer templateId,@PathVariable Integer newValue) {
		Plan plan = planRepository.getOne(templateId);
		if (plan.getTemplate() != null ) {
			Template template = plan.getTemplate().copy(newValue,plan.getStartDate());
			templateService.replaceTemplate(plan.getTemplate(), template);
		} 		
		return MessageID.ok;
	}

	@GetMapping("/changetimerange/{templateId}/{timestring}")
	MessageID changetime(@PathVariable Integer templateId,@PathVariable String timestring) {
		DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("ddMMyyyy");
		Plan plan = planRepository.getOne(templateId);
		LocalDate newDate = null;
		
		try {
			newDate= LocalDate.parse(timestring,dateTimeFormatter);
		}
		catch (DateTimeParseException e) {
			return MessageID.invaliddata;			
		}
		
		if (plan.getTemplate() != null ) {
			Template template = plan.getTemplate().copy(plan.getValue(),newDate);
			templateService.replaceTemplate(plan.getTemplate(), template);
		}	
		return MessageID.ok;
	}

}
