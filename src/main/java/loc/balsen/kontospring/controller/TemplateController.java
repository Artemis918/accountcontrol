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

import loc.balsen.kontospring.data.Template;
import loc.balsen.kontospring.dataservice.TemplateService;
import loc.balsen.kontospring.dto.TemplateDTO;
import loc.balsen.kontospring.repositories.SubCategoryRepository;
import loc.balsen.kontospring.repositories.TemplateRepository;

@Controller
@RequestMapping("/templates")
public class TemplateController {

	@Autowired
	TemplateRepository templateRepository;

	@Autowired
	SubCategoryRepository kontoRepository;

	@Autowired
	TemplateService templateService;

	@GetMapping("/listgroup/{group}")
	@ResponseBody
	List<TemplateDTO> findGroupTemplates(@PathVariable int group) {
		return templateRepository.findValid().stream().filter((template) -> {
			return template.getSubCategory().getCategory().getId() == group;
		}).map((template) -> {
			return new TemplateDTO(template);
		}).collect(Collectors.toList());
	}

	@PostMapping("/save")
	@ResponseBody
	StandardResult saveTemplate(@RequestBody TemplateDTO template) {
		templateService.saveTemplate(template.toTemplate(kontoRepository));
		return new StandardResult(false, "Gespeichert");
	}

	@GetMapping("/delete/{id}")
	@ResponseBody
	StandardResult deleteTemplate(@PathVariable Integer id) {
		Optional<Template> template = templateRepository.findById(id);
		if (template.isPresent()) 
			templateService.deleteTemplate(template.get());;
		return new StandardResult(false, "gelöscht");
	}

	@GetMapping("/accountrecord/{id}")
	@ResponseBody
	TemplateDTO createTemplateFromBeleg(@PathVariable Integer id) {
		return new TemplateDTO(templateService.createFromBeleg(id));
	}
}
