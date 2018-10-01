package loc.balsen.kontospring.belege;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import loc.balsen.kontospring.repositories.BelegRepository;

@Controller
@RequestMapping("/belege")
public class BelegController {
	
	@Autowired
	BelegRepository belegRepository;
	
	@GetMapping("/unassigned")
	@ResponseBody
	List<BelegSmallDTO> findNewBelege() {
		return belegRepository.findUnresolvedBeleg()
				.stream()
				.map((beleg) -> {return new BelegSmallDTO(beleg);})
				.collect(Collectors.toList());
	}
}
