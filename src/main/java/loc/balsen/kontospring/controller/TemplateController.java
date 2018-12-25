package loc.balsen.kontospring.controller;

import java.text.ParseException;
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
import loc.balsen.kontospring.dto.TemplateSmallDTO;
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
	
	@GetMapping("/list")
	@ResponseBody
	List<TemplateSmallDTO> findTemplates() {
		return templateRepository.findAll()
				.stream()
				.map((template) -> {return new TemplateSmallDTO(template);})
				.collect(Collectors.toList());
	}
	
	@PostMapping("/save")
	@ResponseBody
	KontoSpringResult saveTemplate(@RequestBody TemplateDTO template) {
		try {
			templateService.saveTemplate(template.toTemplate(kontoRepository));
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return new KontoSpringResult(false,"Fehler beim Speichern");
		}
		return new KontoSpringResult(false,"Gespeichert");
	}
	
	@GetMapping("/id/{id}")
	@ResponseBody
	TemplateDTO findTemplate(@PathVariable Integer id) {
		Optional<Template> template = templateRepository.findById(id);
		if (template.isPresent()) {
			return (new TemplateDTO(template.get()));
		}
		else {
			return null;
		}
	}
	
	@GetMapping("/delete/{id}")
	@ResponseBody
	KontoSpringResult deleteTemplate(@PathVariable Integer id) {
		templateRepository.deleteById(id);
		return new KontoSpringResult(false,"gelöscht");
	}

	@GetMapping("/beleg/{id}")
	@ResponseBody
	TemplateDTO createTemplateFromBeleg(@PathVariable Integer id) {
		return new TemplateDTO(templateService.createFromBeleg(id));
	}

	
}
