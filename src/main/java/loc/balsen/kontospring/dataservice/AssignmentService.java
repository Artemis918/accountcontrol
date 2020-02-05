package loc.balsen.kontospring.dataservice;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import loc.balsen.kontospring.data.AccountRecord;
import loc.balsen.kontospring.data.SubCategory;
import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.Assignment;
import loc.balsen.kontospring.data.Plan.MatchStyle;
import loc.balsen.kontospring.repositories.PlanRepository;
import loc.balsen.kontospring.repositories.AssignmentRepository;

@Component
public class AssignmentService {

	@Autowired
	AssignmentRepository assignmentRepository;

	@Autowired
	PlanRepository planRepository;

	public int assign(List<AccountRecord> records) {

		if (records.size() == 0)
			return 0;

		// searching for min and max date
		LocalDate maxdate = records.get(0).getExecuted();
		LocalDate mindate = records.get(0).getExecuted();

		for (AccountRecord record : records) {
			LocalDate date = record.getExecuted();
			if (date.isBefore(mindate))
				mindate = date;
			if (date.isAfter(maxdate))
				maxdate = date;
		}

		// get Planlist for period
		return assign(records, planRepository.findByPeriodNotAssigned(mindate, maxdate));
	}

	public int getAssignCount(int subcategory) {
		return assignmentRepository.countBySubCategoryId(subcategory);
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
			boolean period = plan.isInPeriod(record.getExecuted());

			if (!summax && (pattern || period) && plan.matches(record)) {
				plansForRecord.add(plan);
			}
		}

		if (plansForRecord.isEmpty())
			return false;

		int sum = 0;

		for (int i = plansForRecord.size() - 1; i > 0; i--) {
			Plan plan = plansForRecord.get(i);
			assign(record, plan, plan.getValue());
			if (plan.getMatchStyle() != Plan.MatchStyle.PATTERN)
				sum += plan.getValue();
		}

		/// the entry gets the rest
		Plan plan = plansForRecord.get(0);
		assign(record, plan, record.getValue() - sum);

		// remove used plans
		for (Plan plan1 : plansForRecord) {
			if (plan1.getMatchStyle() != MatchStyle.PATTERN)
				plans.remove(plan1);
		}

		return true;
	}

	private void assign(AccountRecord record, Plan plan, int value) {

		Assignment assignment = new Assignment();

		assignment.setAccountrecord(record);
		assignment.setDescription(plan.getDescription());
		assignment.setSubCategory(plan.getSubCategory());
		assignment.setShortdescription(plan.getShortDescription());
		assignment.setValue(value);
		assignment.setCommitted(false);

		if (plan.getMatchStyle() != Plan.MatchStyle.PATTERN) {
			assignment.setPlan(plan);
		}

		assignmentRepository.save(assignment);
	}

	public List<AccountRecord> deleteDeactivated(List<Plan> deactivatedPlans) {
		List<AccountRecord> result = new ArrayList<>();
		for (Plan plan : deactivatedPlans) {
			Assignment assignment = assignmentRepository.findByPlan(plan);
			if (assignment != null) {
				result.add(assignment.getAccountrecord());
				assignmentRepository.delete(assignment);
			}
		}
		return result;
	}

	public void assignToSubCategory(SubCategory subCategory, String text, AccountRecord record) {
		if (text.isEmpty())
			text = record.getOtherParty();

		Assignment assignment = new Assignment();

		assignment.setAccountrecord(record);
		assignment.setDescription(text);
		assignment.setSubCategory(subCategory);
		assignment.setShortdescription(text);
		assignment.setValue(record.getValue());
		assignment.setCommitted(false);
		assignmentRepository.save(assignment);
	}

	public void assignToPlan(Plan plan, AccountRecord record) {
		Assignment assignment = new Assignment();

		assignment.setAccountrecord(record);
		assignment.setDescription(plan.getDescription());
		assignment.setSubCategory(plan.getSubCategory());
		assignment.setShortdescription(plan.getShortDescription());
		assignment.setValue(record.getValue());
		assignment.setPlan(plan);
		assignment.setCommitted(true);
		assignmentRepository.save(assignment);
	}

	public void deleteBySubCategoryId(int subCategory) {
		assignmentRepository.deleteBySubCategoryId(subCategory);
	}

}
