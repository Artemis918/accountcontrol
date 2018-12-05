package loc.balsen.kontospring.templates;

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
import loc.balsen.kontospring.dataservice.EnumDTO;
import loc.balsen.kontospring.repositories.BelegRepository;
import loc.balsen.kontospring.repositories.KontoRepository;
import loc.balsen.kontospring.repositories.TemplateRepository;

@Controller
@RequestMapping("/templates")
public class TemplateController {
	
	@Autowired
	TemplateRepository templateRepository;
	
	@Autowired
	KontoRepository kontoRepository;
	
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
	TemplateResult saveTemplate(@RequestBody TemplateDTO template) {
		try {
			templateRepository.save(template.toTemplate(kontoRepository));
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return new TemplateResult(false,"Fehler beim Speichern");
		}
		return new TemplateResult(false,"Gespeichert");
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
	TemplateResult deleteTemplate(@PathVariable Integer id) {
		templateRepository.deleteById(id);
		return new TemplateResult(false,"gelöscht");
	}
}
