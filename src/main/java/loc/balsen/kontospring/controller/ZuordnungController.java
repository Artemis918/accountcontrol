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
import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.Zuordnung;
import loc.balsen.kontospring.dataservice.ZuordnungService;
import loc.balsen.kontospring.dto.ZuordnungDTO;
import loc.balsen.kontospring.repositories.BuchungsBelegRepository;
import loc.balsen.kontospring.repositories.KontoRepository;
import loc.balsen.kontospring.repositories.PlanRepository;
import loc.balsen.kontospring.repositories.ZuordnungRepository;
import lombok.Data;

@Controller
@RequestMapping("/assign")
public class ZuordnungController {

	@Autowired
	private KontoRepository kontoRepository;

	@Autowired
	private ZuordnungRepository zuordnungRepository;

	@Autowired
	private ZuordnungService zuordnungService;

	@Autowired
	private BuchungsBelegRepository buchungsBelegRepository;

	@Autowired
	private PlanRepository planRepository;

	@GetMapping("/all")
	@ResponseBody
	public KontoSpringResult assignAll() {
		List<BuchungsBeleg> belege = buchungsBelegRepository.findUnresolvedBeleg();
		zuordnungService.assign(belege);
		return new KontoSpringResult(false, "Alles zugeordnet");
	}

	@GetMapping("/getKontoGroup/{year}/{month}/{id}")
	@ResponseBody
	public List<ZuordnungDTO> getKontoGroup(@PathVariable int id, @PathVariable int month, @PathVariable int year) {
		List<Zuordnung> zuordnungen = new ArrayList<>();
		List<Konto> kontolist = kontoRepository.findByKontoGruppeId(id);
		LocalDate start = LocalDate.of(year, month, 1);
		LocalDate end = LocalDate.of(year, month, start.lengthOfMonth());
		for (Konto konto : kontolist) {
			zuordnungen.addAll(zuordnungRepository.findByKontoAndMonth(start, end, konto.getId()));
		}

		List<ZuordnungDTO> zdtos = zuordnungen.stream().map(z -> {
			return new ZuordnungDTO(z);
		}).collect(Collectors.toList());

		zdtos.addAll(planRepository.findByPlanDateNotPlanned(start, end).stream().filter(p -> {
			return contains(p, kontolist);
		}).map(p -> {
			return new ZuordnungDTO(p);
		}).collect(Collectors.toList()));

		zdtos.sort((z1, z2) -> z1.compareGroup(z2));
		return zdtos;
	}

	private boolean contains(Plan p, List<Konto> kontolist) {
		return kontolist.contains(p.getKonto());
	}

	@GetMapping("/getKonto/{year}/{month}/{id}")
	@ResponseBody
	public List<ZuordnungDTO> getKonto(@PathVariable int id, @PathVariable int month, @PathVariable int year) {
		LocalDate start = LocalDate.of(year, month, 1);
		LocalDate end = LocalDate.of(year, month, start.lengthOfMonth());

		List<ZuordnungDTO> zuordnungen = zuordnungRepository.findByKontoAndMonth(start, end, id).stream().map(z -> {
			return new ZuordnungDTO(z);
		}).collect(Collectors.toList());

		zuordnungen.addAll(
				planRepository.findByPlanDateNotPlanned(start, end).stream().filter(p -> p.getKonto().getId() == id).map(p -> {
					return new ZuordnungDTO(p);
				}).collect(Collectors.toList()));

		zuordnungen.sort((z1, z2) -> z1.compareKonto(z2));
		return zuordnungen;
	}

	@PostMapping("/commit")
	@ResponseBody
	public KontoSpringResult invertCommit(@RequestBody List<Integer> ids) {
		for (Integer id : ids) {
			Optional<Zuordnung> zuordnung = zuordnungRepository.findById(id);
			if (zuordnung.isPresent()) {
				Zuordnung z = zuordnung.get();
				z.setCommitted(!z.isCommitted());
				zuordnungRepository.save(z);
			}
		}
		return new KontoSpringResult(false, "ok");
	}

	@PostMapping("/remove")
	@ResponseBody
	public KontoSpringResult remove(@RequestBody List<Integer> ids) {
		for (Integer id : ids) {
			zuordnungRepository.deleteByBelegId(id);
		}
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
	public KontoSpringResult assignToKonto(@RequestBody ToKontoRequestDTO request) {
		Konto konto = kontoRepository.getOne(request.konto);

		request.ids.forEach(
				(Integer z) -> zuordnungService.assignToKonto(konto, request.text, buchungsBelegRepository.getOne(z)));
		return new KontoSpringResult(false, "zugeordnet");
	}

	@GetMapping("/toplan/{planid}/{belegid}")
	@ResponseBody
	public KontoSpringResult assignToPlan(@PathVariable int planid, @PathVariable int belegid) {
		zuordnungService.assignToPlan(planRepository.getOne(planid), buchungsBelegRepository.getOne(belegid));
		return new KontoSpringResult(false, "zugeordnet");
	}

	@PostMapping("/parts")
	@ResponseBody
	public KontoSpringResult assignParts(@RequestBody List<ZuordnungDTO> request) {

		request.forEach((ZuordnungDTO z) -> {
			if (z.getIstwert()!= 0) 
				zuordnungRepository.save(
						z.toZuordnung(planRepository, kontoRepository, buchungsBelegRepository));
		});
		return new KontoSpringResult(false, "zugeordnet");
	}
}
