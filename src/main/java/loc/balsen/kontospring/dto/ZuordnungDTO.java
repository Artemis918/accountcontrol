package loc.balsen.kontospring.dto;

import loc.balsen.kontospring.data.Konto;
import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.Zuordnung;
import loc.balsen.kontospring.repositories.BuchungsBelegRepository;
import loc.balsen.kontospring.repositories.KontoRepository;
import loc.balsen.kontospring.repositories.PlanRepository;
import lombok.Data;

@Data
public class ZuordnungDTO {

	int id;
	String detail;
	String description;
	int sollwert;
	int istwert;
	boolean committed;
	int plan;
	int beleg;
	int konto;
	int group;

	public ZuordnungDTO() {}
	
	public ZuordnungDTO(Zuordnung z) {
		id = z.getId();
		detail = z.getShortdescription();
		istwert = z.getWert();
		beleg = z.getBuchungsbeleg().getId();
		committed = z.isCommitted();

		Plan p = z.getPlan();
		if (p != null) {
			plan = p.getId();
			sollwert = p.getWert();
		}

		Konto k = z.getKonto();
		if (k != null) {
			group = k.getKontoGruppe().getId();
			konto = k.getId();
		}
	}

	public Zuordnung toZuordnung(PlanRepository planRepository, KontoRepository kontoRepository,
			BuchungsBelegRepository belegRepository) {
		Zuordnung res = new Zuordnung();
		res.setId(id);
		res.setShortdescription(detail);
		res.setDescription(description);
		res.setWert(istwert);
		res.setCommitted(committed);

		if (plan != 0)
			res.setPlan(planRepository.getOne(plan));

		if (beleg != 0)
			res.setBuchungsbeleg(belegRepository.getOne(beleg));

		if (konto != 0) 
			res.setKonto(kontoRepository.getOne(konto));
		return res;
	}
}
