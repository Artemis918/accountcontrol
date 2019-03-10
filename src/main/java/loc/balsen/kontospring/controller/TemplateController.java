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
import loc.balsen.kontospring.repositories.KontoRepository;
import loc.balsen.kontospring.repositories.TemplateRepository;

@Controller
@RequestMapping("/templates")
public class TemplateController {

	@Autowired
	TemplateRepository templateRepository;

	@Autowired
	KontoRepository kontoRepository;

	@Autowired
	TemplateService templateService;

	@GetMapping("/listgroup/{group}")
	@ResponseBody
	List<TemplateDTO> findGroupTemplates(@PathVariable int group) {
		return templateRepository.findValid().stream().filter((template) -> {
			return template.getKonto().getKontoGruppe().getId() == group;
		}).map((template) -> {
			return new TemplateDTO(template);
		}).collect(Collectors.toList());
	}

	@PostMapping("/save")
	@ResponseBody
	KontoSpringResult saveTemplate(@RequestBody TemplateDTO template) {
		templateService.saveTemplate(template.toTemplate(kontoRepository));
		return new KontoSpringResult(false, "Gespeichert");
	}

	@GetMapping("/delete/{id}")
	@ResponseBody
	KontoSpringResult deleteTemplate(@PathVariable Integer id) {
		Optional<Template> template = templateRepository.findById(id);
		if (template.isPresent()) 
			templateService.deleteTemplate(template.get());;
		return new KontoSpringResult(false, "gelöscht");
	}

	@GetMapping("/beleg/{id}")
	@ResponseBody
	TemplateDTO createTemplateFromBeleg(@PathVariable Integer id) {
		return new TemplateDTO(templateService.createFromBeleg(id));
	}
}
