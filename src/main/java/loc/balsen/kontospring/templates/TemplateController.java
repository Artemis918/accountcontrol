package loc.balsen.kontospring.templates;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import loc.balsen.kontospring.repositories.BelegRepository;
import loc.balsen.kontospring.repositories.TemplateRepository;

@Controller
@RequestMapping("/templates")
public class TemplateController {
	
	@Autowired
	TemplateRepository templateRepository;
	
	@GetMapping("/list")
	@ResponseBody
	List<TemplateSmallDTO> findNewBelege() {
		return templateRepository.findAll()
				.stream()
				.map((template) -> {return new TemplateSmallDTO(template);})
				.collect(Collectors.toList());
	}
}
