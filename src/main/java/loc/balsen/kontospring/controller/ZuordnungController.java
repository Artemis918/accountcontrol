package loc.balsen.kontospring.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import loc.balsen.kontospring.data.BuchungsBeleg;
import loc.balsen.kontospring.data.SubCategory;
import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.Template;
import loc.balsen.kontospring.data.Zuordnung;
import loc.balsen.kontospring.dataservice.TemplateService;
import loc.balsen.kontospring.dataservice.ZuordnungService;
import loc.balsen.kontospring.dto.ZuordnungDTO;
import loc.balsen.kontospring.repositories.BuchungsBelegRepository;
import loc.balsen.kontospring.repositories.SubCategoryRepository;
import loc.balsen.kontospring.repositories.PlanRepository;
import loc.balsen.kontospring.repositories.ZuordnungRepository;
import lombok.Data;

@Controller
@RequestMapping("/assign")
public class ZuordnungController {

	private SubCategoryRepository subCategoryRepository;
	private ZuordnungRepository assignRepository;
	private ZuordnungService assignService;
	private TemplateService templateService;
	private BuchungsBelegRepository buchungsBelegRepository;
	private PlanRepository planRepository;

	@Autowired
	public ZuordnungController(	
			SubCategoryRepository subCategoryRepository,
			ZuordnungRepository zuordnungRepository,
			ZuordnungService zuordnungService,
			TemplateService templateService,
			BuchungsBelegRepository buchungsBelegRepository,
			PlanRepository planRepository) {
		this.subCategoryRepository = subCategoryRepository;
		this.assignRepository = zuordnungRepository;
		this.assignService = zuordnungService;
		this.templateService = templateService;
		this.buchungsBelegRepository = buchungsBelegRepository;
		this.planRepository = planRepository;
	}

	@GetMapping("/all")
	@ResponseBody
	public StandardResult assignAll() {
		List<BuchungsBeleg> belege = buchungsBelegRepository.findUnresolvedBeleg();
		assignService.assign(belege);
		return new StandardResult(false, "Alles zugeordnet");
	}

	@GetMapping("/getcategory/{year}/{month}/{id}")
	@ResponseBody
	public List<ZuordnungDTO> getCategory(@PathVariable int id, @PathVariable int month, @PathVariable int year) {
		List<Zuordnung> zuordnungen = new ArrayList<>();
		List<SubCategory> kontolist = subCategoryRepository.findByCategoryId(id);
		LocalDate start = LocalDate.of(year, month, 1);
		LocalDate end = LocalDate.of(year, month, start.lengthOfMonth());
		for (SubCategory konto : kontolist) {
			zuordnungen.addAll(assignRepository.findBySubCategoryAndMonth(start, end, konto.getId()));
		}

		List<ZuordnungDTO> zdtos = zuordnungen.stream().map(z -> {
			return new ZuordnungDTO(z);
		}).collect(Collectors.toList());

		zdtos.addAll(planRepository.findByPlanDateNotAssigned(start, end).stream().filter(p -> {
			return contains(p, kontolist);
		}).map(p -> {
			return new ZuordnungDTO(p);
		}).collect(Collectors.toList()));

		zdtos.sort((z1, z2) -> z1.compareCategory(z2));
		return zdtos;
	}

	private boolean contains(Plan p, List<SubCategory> kontolist) {
		return kontolist.contains(p.getSubCategory());
	}

	@GetMapping("/getsubcategory/{year}/{month}/{id}")
	@ResponseBody
	public List<ZuordnungDTO> getSubcategory(@PathVariable int id, @PathVariable int month, @PathVariable int year) {
		LocalDate start = LocalDate.of(year, month, 1);
		LocalDate end = LocalDate.of(year, month, start.lengthOfMonth());

		List<ZuordnungDTO> zuordnungen = assignRepository.findBySubCategoryAndMonth(start, end, id).stream().map(z -> {
			return new ZuordnungDTO(z);
		}).collect(Collectors.toList());

		zuordnungen.addAll(
				planRepository.findByPlanDateNotAssigned(start, end).stream().filter(p -> p.getSubCategory().getId() == id).map(p -> {
					return new ZuordnungDTO(p);
				}).collect(Collectors.toList()));

		zuordnungen.sort((z1, z2) -> z1.compareSubCategory(z2));
		return zuordnungen;
	}

	
	@GetMapping(path="/countsubcategory/{id}",produces = MediaType.TEXT_PLAIN_VALUE)
	@ResponseBody
	String countAssignForSubCategory(@PathVariable Integer id) {
		return Integer.toString(assignService.getAssignCount(id));
	}
	
	@PostMapping("/commit")
	@ResponseBody
	public StandardResult commit(@RequestBody List<Integer> ids) {
		for (Integer id : ids) {
			Optional<Zuordnung> zuordnung = assignRepository.findById(id);
			if (zuordnung.isPresent()) {
				Zuordnung z = zuordnung.get();
				z.setCommitted(true);
				assignRepository.save(z);
			}
		}
		return new StandardResult(false, "ok");
	}
	
	@GetMapping("/invertcommit/{id}")
	@ResponseBody
	public StandardResult invertCommit(@PathVariable int id) {
		Optional<Zuordnung> zuordnung = assignRepository.findById(id);
		if (zuordnung.isPresent()) {
			Zuordnung z = zuordnung.get();
			z.setCommitted(!z.isCommitted());
			assignRepository.save(z);
		}
		return new StandardResult(false, "ok");	
	}

	@PostMapping("/remove")
	@ResponseBody
	public StandardResult remove(@RequestBody List<Integer> ids) {
		for (Integer id : ids) {
			assignRepository.deleteByBelegId(id);
		}
		return new StandardResult(false, "ok");
	}

	@Data
	static class ToCategoryRequestDTO {
		public int subcategory;
		public String text;
		public List<Integer> ids;
	}

	@PostMapping("/tosubcategory")
	@ResponseBody
	public StandardResult assignToCategory(@RequestBody ToCategoryRequestDTO request) {
		SubCategory konto = subCategoryRepository.getOne(request.subcategory);

		request.ids.forEach(
				(Integer z) -> assignService.assignToSubCategory(konto, request.text, buchungsBelegRepository.getOne(z)));
		return new StandardResult(false, "zugeordnet");
	}

	@GetMapping("/toplan/{planid}/{belegid}")
	@ResponseBody
	public StandardResult assignToPlan(@PathVariable int planid, @PathVariable int belegid) {
		assignService.assignToPlan(planRepository.getOne(planid), buchungsBelegRepository.getOne(belegid));
		return new StandardResult(false, "zugeordnet");
	}

	@PostMapping("/parts")
	@ResponseBody
	public StandardResult assignParts(@RequestBody List<ZuordnungDTO> request) {

		request.forEach((ZuordnungDTO z) -> {
			if (z.getIstwert()!= 0) 
				assignRepository.save(
						z.toZuordnung(planRepository, subCategoryRepository, buchungsBelegRepository));
		});
		return new StandardResult(false, "zugeordnet");
	}

	@GetMapping("/endplan/{id}")
	@ResponseBody
	StandardResult endplan(@PathVariable Integer id) {
		Plan plan = planRepository.getOne(id);
		if ( plan.getTemplate() != null ) {
			Template template = plan.getTemplate();
			template.setValidUntil(plan.getStartDate());
			templateService.saveTemplate(template);
		} 		
		return new StandardResult(false, "Gespeichert");
	}
	
	@GetMapping("/replan/{id}")
	@ResponseBody
	StandardResult replan(@PathVariable Integer id) {
		Zuordnung zuordnung = assignRepository.getOne(id);
		if (zuordnung.getPlan() != null && zuordnung.getPlan().getTemplate() != null ) {
			BuchungsBeleg beleg = zuordnung.getBuchungsbeleg();
			Template template = zuordnung.getPlan().getTemplate().copy(zuordnung.getWert(),zuordnung.getPlan().getStartDate());
			
			assignRepository.delete(zuordnung);
			templateService.saveTemplate(template);
			
			List<BuchungsBeleg> list = new ArrayList<BuchungsBeleg>();
			list.add(beleg);
			assignService.assign(list);
		} 		
		return new StandardResult(false, "Gespeichert");
	}
}
