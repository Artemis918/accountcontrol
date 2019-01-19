package loc.balsen.kontospring.dataservice;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import loc.balsen.kontospring.data.BuchungsBeleg;
import loc.balsen.kontospring.data.Konto;
import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.Zuordnung;
import loc.balsen.kontospring.repositories.PlanRepository;
import loc.balsen.kontospring.repositories.ZuordnungRepository;

@Component
public class ZuordnungService {

	@Autowired
	ZuordnungRepository zuordnungRepository;

	@Autowired
	PlanRepository planRepository;

	public void assign(List<BuchungsBeleg> belege) {

		if (belege.size() == 0)
			return;

		// searching for min and max date
		LocalDate maxdate = belege.get(0).getBeleg();
		LocalDate mindate = belege.get(0).getBeleg();

		for (BuchungsBeleg buchungsbeleg : belege) {
			LocalDate date = buchungsbeleg.getBeleg();
			if (date.isBefore(mindate))
				mindate = date;
			if (date.isAfter(maxdate))
				maxdate = date;
		}

		// get Planlist for period
		assign(belege, planRepository.findByPeriod(mindate, maxdate));
	}

	public void assign(List<BuchungsBeleg> belege, List<Plan> plans) {

		for (BuchungsBeleg buchungsbeleg : belege)
			assign(buchungsbeleg, plans);
	}

	public boolean assign(BuchungsBeleg beleg, List<Plan> plans) {

		List<Plan> plansForBeleg = new ArrayList<>();

		for (Plan plan : plans) {
			boolean pattern = plan.getMatchStyle() == Plan.MatchStyle.PATTERN;
			boolean period = plan.isInPeriod(beleg.getBeleg());

			if ((pattern || period) && plan.matches(beleg)) {
				plansForBeleg.add(plan);
			}
		}

		if (plansForBeleg.isEmpty())
			return false;

		int summe = 0;

		for (int i = plansForBeleg.size() - 1; i > 0; i--) {
			Plan plan = plansForBeleg.get(i);
			assign(beleg, plan, plan.getWert());
			summe += plan.getWert();
		}

		/// the entry gets the rest
		Plan plan = plansForBeleg.get(0);
		assign(beleg, plan, beleg.getWert() - summe);

		return true;
	}

	private void assign(BuchungsBeleg beleg, Plan plan, int wert) {

		Zuordnung zuordnung = new Zuordnung();

		zuordnung.setBuchungsbeleg(beleg);
		zuordnung.setDescription(plan.getDescription());
		zuordnung.setKonto(plan.getKonto());
		zuordnung.setShortdescription(plan.getShortDescription());
		zuordnung.setWert(wert);
		zuordnung.setCommited(false);
		
		if ( plan.getMatchStyle() != Plan.MatchStyle.PATTERN) {
			zuordnung.setPlan(plan);
		}
		
		// Save zurordnung
		zuordnungRepository.save(zuordnung);
	}
	
	public List<BuchungsBeleg> deleteDeactivated(List<Plan> deactivatedPlans) {
		List<BuchungsBeleg> result = new ArrayList<>();
		for (Plan plan : deactivatedPlans) {
			Zuordnung zuordnung = zuordnungRepository.findByPlan(plan);
			if (zuordnung != null) {
				result.add(zuordnung.getBuchungsbeleg());
				zuordnungRepository.delete(zuordnung);
			}
		}
		return result;
	}
	
	public void assignToKonto(Konto konto, String text, BuchungsBeleg beleg) {
		if (text.isEmpty())
			text = beleg.getDetails();
		
		Zuordnung zuordnung = new Zuordnung();

		zuordnung.setBuchungsbeleg(beleg);
		zuordnung.setDescription(text);
		zuordnung.setKonto(konto);
		zuordnung.setShortdescription(text);
		zuordnung.setWert(beleg.getWert());
		zuordnung.setCommited(false);
		zuordnungRepository.save(zuordnung);
	}

}
