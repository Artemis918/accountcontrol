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

import loc.balsen.kontospring.data.BuchungsBeleg;
import loc.balsen.kontospring.dto.BelegDTO;
import loc.balsen.kontospring.repositories.BuchungsBelegRepository;

@Controller
@RequestMapping("/belege")
public class BelegController {
	
	@Autowired
	BuchungsBelegRepository belegRepository;
	
	@GetMapping("/unassigned")
	@ResponseBody
	List<BelegDTO> findNewBelege() {
		return belegRepository.findUnresolvedBeleg()
				.stream()
				.map((beleg) -> {return new BelegDTO(beleg);})
				.collect(Collectors.toList());
	}
	
	@GetMapping("/manlist")
	@ResponseBody
	List<BelegDTO> findManuelleBelege() {
		return belegRepository.findByArt(BuchungsBeleg.Art.MANUELL)
				.stream()
				.map((beleg) -> {return new BelegDTO(beleg);})
				.collect(Collectors.toList());
	}
	
	@PostMapping("/save")
	@ResponseBody
	KontoSpringResult saveBeleg(@RequestBody BelegDTO belegdto) {
		if (belegdto.getId() == 0 || belegdto.getArt()==BuchungsBeleg.Art.MANUELL) {
			BuchungsBeleg beleg = belegdto.toBeleg();
			beleg.setArt(BuchungsBeleg.Art.MANUELL);
			beleg.setEingang(LocalDate.now());
			belegRepository.save(beleg);
			return new KontoSpringResult(false,"Gespeichert");
		}
		else
			return new KontoSpringResult(true,"kein manueller Beleg");
	}
	
	@GetMapping("/id/{id}")
	@ResponseBody
	BelegDTO findTemplate(@PathVariable Integer id) {
		Optional<BuchungsBeleg> beleg = belegRepository.findById(id);
		if (beleg.isPresent()) {
			return (new BelegDTO(beleg.get()));
		}
		else {
			return null;
		}
	}
	
	@GetMapping("/delete/{id}")
	@ResponseBody
	KontoSpringResult deleteTemplate(@PathVariable Integer id) {
		Optional<BuchungsBeleg> beleg = belegRepository.findById(id);
		if (beleg.isPresent() && beleg.get().getArt() == BuchungsBeleg.Art.MANUELL)
			belegRepository.deleteById(id);
		return new KontoSpringResult(false,"gelöscht");
	}
}
