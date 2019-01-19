package loc.balsen.kontospring.controller;

import java.time.LocalDate;
import java.util.ArrayList;
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
import loc.balsen.kontospring.data.Konto;
import loc.balsen.kontospring.data.Zuordnung;
import loc.balsen.kontospring.dataservice.ZuordnungService;
import loc.balsen.kontospring.dto.ZuordnungDTO;
import loc.balsen.kontospring.repositories.BuchungsBelegRepository;
import loc.balsen.kontospring.repositories.KontoRepository;
import loc.balsen.kontospring.repositories.ZuordnungRepository;
import lombok.Data;

@Controller
@RequestMapping("/assign")
public class ZuordnungController {

	@Autowired
	KontoRepository kontoRepository;

	@Autowired
	ZuordnungRepository zuordnungRepository;

	@Autowired
	ZuordnungService zuordnungService;

	@Autowired
	BuchungsBelegRepository buchungsBelegRepository;

	@GetMapping("/all")
	@ResponseBody
	KontoSpringResult assignAll() {
		List<BuchungsBeleg> belege = buchungsBelegRepository.findUnresolvedBeleg();
		zuordnungService.assign(belege);
		return new KontoSpringResult(false, "Alles zugeordnet");
	}

	@GetMapping("/getKontoGroup/{year}/{month}/{id}")
	@ResponseBody
	List<ZuordnungDTO> getKontoGroup(@PathVariable int id, @PathVariable int month, @PathVariable int year) {
		List<Zuordnung> assingments = new ArrayList<>();
		List<Konto> kontolist = kontoRepository.findByKontoGruppeId(id);
		LocalDate start = LocalDate.of(year, month, 1);
		LocalDate end = LocalDate.of(year, month, start.lengthOfMonth());
		for (Konto konto : kontolist) {
			assingments.addAll(zuordnungRepository.findByKontoAndMonth(start, end, konto.getId()));
		}
		return assingments.stream().map(z -> {
			return new ZuordnungDTO(z);
		}).collect(Collectors.toList());
	}

	@GetMapping("/getKonto/{year}/{month}/{id}")
	@ResponseBody
	List<ZuordnungDTO> getKonto(@PathVariable int id, @PathVariable int month, @PathVariable int year) {
		LocalDate start = LocalDate.of(year, month, 1);
		LocalDate end = LocalDate.of(year, month, start.lengthOfMonth());
		return zuordnungRepository.findByKontoAndMonth(start, end, id).stream().map(z -> {
			return new ZuordnungDTO(z);
		}).collect(Collectors.toList());
	}

	@GetMapping("/getKonto/commit/{id}")
	@ResponseBody
	KontoSpringResult invertCommit(@PathVariable int id) {
		Optional<Zuordnung> zuordnung = zuordnungRepository.findById(id);
		if (zuordnung.isPresent()) {
			Zuordnung z = zuordnung.get(); 
			z.setCommited(!z.getCommited());
			zuordnungRepository.save(z);
		}
		return new KontoSpringResult(false, "ok");
	}

	@GetMapping("/getKonto/remove/{id}")
	@ResponseBody
	KontoSpringResult remove(@PathVariable int id) {
		zuordnungRepository.deleteById(id);
		return new KontoSpringResult(false, "ok");
	}
	
	@Data
	static class ToKontoRequestDTO {
		public int konto;
		public String text;
		public List<Integer> ids;
	};
	
	@PostMapping("/tokonto")
	@ResponseBody
	KontoSpringResult assignToKonto(@RequestBody ToKontoRequestDTO request) {
		Konto konto = kontoRepository.getOne(request.konto);
		
		request.ids.forEach(
				(Integer z)->zuordnungService.assignToKonto(konto, request.text, buchungsBelegRepository.getOne(z)));
		return new KontoSpringResult(false,"zugeordnet");
	}
}
