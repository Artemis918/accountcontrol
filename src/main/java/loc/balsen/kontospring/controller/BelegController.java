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
	
	@GetMapping("/manlist/{year}/{month}")
	@ResponseBody
	List<BelegDTO> findManuelleBelege(@PathVariable Integer year, @PathVariable Integer month) {
		LocalDate start = LocalDate.of(year, month, 1);
		LocalDate end = LocalDate.of(year, month, start.lengthOfMonth());
		
		return belegRepository.findByArtAndPeriod(start,end,BuchungsBeleg.Art.MANUELL.ordinal())
				.stream()
				.map((beleg) -> {return new BelegDTO(beleg);})
				.collect(Collectors.toList());
	}
	
	@PostMapping("/save")
	@ResponseBody
	StandardResult saveBeleg(@RequestBody BelegDTO belegdto) {
		if (belegdto.getId() == 0 || belegdto.getArt()==BuchungsBeleg.Art.MANUELL) {
			BuchungsBeleg beleg = belegdto.toBeleg();
			beleg.setArt(BuchungsBeleg.Art.MANUELL);
			beleg.setEingang(LocalDate.now());
			belegRepository.save(beleg);
			return new StandardResult(false,"Gespeichert");
		}
		else
			return new StandardResult(true,"kein manueller Beleg");
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
	StandardResult deleteTemplate(@PathVariable Integer id) {
		Optional<BuchungsBeleg> beleg = belegRepository.findById(id);
		if (beleg.isPresent() && beleg.get().getArt() == BuchungsBeleg.Art.MANUELL)
			belegRepository.deleteById(id);
		return new StandardResult(false,"gelöscht");
	}
}
