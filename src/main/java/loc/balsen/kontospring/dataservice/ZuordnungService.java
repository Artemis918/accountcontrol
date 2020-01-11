package loc.balsen.kontospring.dataservice;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import loc.balsen.kontospring.data.AccountRecord;
import loc.balsen.kontospring.data.SubCategory;
import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.Zuordnung;
import loc.balsen.kontospring.data.Plan.MatchStyle;
import loc.balsen.kontospring.repositories.PlanRepository;
import loc.balsen.kontospring.repositories.ZuordnungRepository;

@Component
public class ZuordnungService {

	@Autowired
	ZuordnungRepository zuordnungRepository;

	@Autowired
	PlanRepository planRepository;

	public int assign(List<AccountRecord> records) {

		if (records.size() == 0)
			return 0;

		// searching for min and max date
		LocalDate maxdate = records.get(0).getCreation();
		LocalDate mindate = records.get(0).getCreation();

		for (AccountRecord record : records) {
			LocalDate date = record.getCreation();
			if (date.isBefore(mindate))
				mindate = date;
			if (date.isAfter(maxdate))
				maxdate = date;
		}

		// get Planlist for period
		return assign(records, planRepository.findByPeriodNotAssigned(mindate, maxdate));
	}

	public int getAssignCount(int subcategory) {
		return zuordnungRepository.countBySubcategoryId(subcategory);
	}
	
	private int assign(List<AccountRecord> records, List<Plan> plans) {
		
		int count = 0;
		
		for (AccountRecord record : records)
			if (assign(record, plans))
				count++;
		return count;
	}
	
	public boolean assign(AccountRecord record, List<Plan> plans) {

		List<Plan> plansForRecord = new ArrayList<>();

		for (Plan plan : plans) {
			boolean pattern = plan.getMatchStyle() == Plan.MatchStyle.PATTERN;
			boolean summax = plan.getMatchStyle() == Plan.MatchStyle.SUMMAX;
			boolean period = plan.isInPeriod(record.getCreation());

			if (!summax && (pattern || period) && plan.matches(record)) {
				plansForRecord.add(plan);
			}
		}

		if (plansForRecord.isEmpty())
			return false;

		int summe = 0;

		for (int i = plansForRecord.size() - 1; i > 0; i--) {
			Plan plan = plansForRecord.get(i);
			assign(record, plan, plan.getWert());
			if (plan.getMatchStyle() != Plan.MatchStyle.PATTERN)
				summe += plan.getWert();
		}

		/// the entry gets the rest
		Plan plan = plansForRecord.get(0);
		assign(record, plan, record.getWert() - summe);

		// remove used plans
		for (Plan plan1 : plansForRecord) {
			if (plan1.getMatchStyle() != MatchStyle.PATTERN)
				plans.remove(plan1);
		}

		return true;
	}

	private void assign(AccountRecord record, Plan plan, int wert) {

		Zuordnung zuordnung = new Zuordnung();

		zuordnung.setAccountrecord(record);
		zuordnung.setDescription(plan.getDescription());
		zuordnung.setSubcategory(plan.getSubCategory());
		zuordnung.setShortdescription(plan.getShortDescription());
		zuordnung.setWert(wert);
		zuordnung.setCommitted(false);

		if (plan.getMatchStyle() != Plan.MatchStyle.PATTERN) {
			zuordnung.setPlan(plan);
		}

		zuordnungRepository.save(zuordnung);
	}

	public List<AccountRecord> deleteDeactivated(List<Plan> deactivatedPlans) {
		List<AccountRecord> result = new ArrayList<>();
		for (Plan plan : deactivatedPlans) {
			Zuordnung zuordnung = zuordnungRepository.findByPlan(plan);
			if (zuordnung != null) {
				result.add(zuordnung.getAccountrecord());
				zuordnungRepository.delete(zuordnung);
			}
		}
		return result;
	}

	public void assignToSubCategory(SubCategory subCategory, String text, AccountRecord record) {
		if (text.isEmpty())
			text = record.getPartner();

		Zuordnung zuordnung = new Zuordnung();

		zuordnung.setAccountrecord(record);
		zuordnung.setDescription(text);
		zuordnung.setSubcategory(subCategory);
		zuordnung.setShortdescription(text);
		zuordnung.setWert(record.getWert());
		zuordnung.setCommitted(false);
		zuordnungRepository.save(zuordnung);
	}

	public void assignToPlan(Plan plan, AccountRecord record) {
		Zuordnung zuordnung = new Zuordnung();

		zuordnung.setAccountrecord(record);
		zuordnung.setDescription(plan.getDescription());
		zuordnung.setSubcategory(plan.getSubCategory());
		zuordnung.setShortdescription(plan.getShortDescription());
		zuordnung.setWert(record.getWert());
		zuordnung.setPlan(plan);
		zuordnung.setCommitted(true);
		zuordnungRepository.save(zuordnung);
	}

	public void deleteBySubCategoryId(int subCategory) {
		zuordnungRepository.deleteBySubcategoryId(subCategory);
	}

}
