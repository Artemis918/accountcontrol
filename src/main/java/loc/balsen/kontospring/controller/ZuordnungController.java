package loc.balsen.kontospring.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import loc.balsen.kontospring.data.BuchungsBeleg;
import loc.balsen.kontospring.dataservice.ZuordnungService;
import loc.balsen.kontospring.repositories.BuchungsBelegRepository;

@Controller
@RequestMapping("/assign")
public class ZuordnungController {

	@Autowired
	ZuordnungService zuordnungService;
	
	@Autowired
	BuchungsBelegRepository buchungsBelegRepository;
	
	@PostMapping("/all")
	@ResponseBody
	KontoSpringResult assignAll() {
		List<BuchungsBeleg> belege = buchungsBelegRepository.findUnresolvedBeleg();
		zuordnungService.assign(belege);
		return new KontoSpringResult(false, "Alles zugeordnet");
	}
	
}
