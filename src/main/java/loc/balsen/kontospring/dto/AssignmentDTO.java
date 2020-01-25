package loc.balsen.kontospring.dto;

import loc.balsen.kontospring.data.SubCategory;
import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.Assignment;
import loc.balsen.kontospring.repositories.AccountRecordRepository;
import loc.balsen.kontospring.repositories.SubCategoryRepository;
import loc.balsen.kontospring.repositories.PlanRepository;
import lombok.Data;

@Data
public class AssignmentDTO {

	int id;
	String detail;
	String description;
	int planed;
	int real;
	boolean committed;
	int plan;
	int accountrecord;
	int subcategory;
	int category;
	int position;
	
	public AssignmentDTO() {}
	
	public AssignmentDTO(Assignment z) {
		id = z.getId();
		detail = z.getShortdescription();
		real = z.getValue();
		accountrecord = z.getAccountrecord().getId();
		committed = z.isCommitted();
		position = 2000;
		Plan p = z.getPlan();
		if (p != null) {
			plan = p.getId();
			planed = p.getValue();
			position = p.getPosition();
		}

		SubCategory s = z.getSubCategory();
		if (s != null) {
			category = s.getCategory().getId();
			subcategory = s.getId();
		}
	}

	public AssignmentDTO(Plan p) {
		id = 0;
		detail = p.getShortDescription();
		planed = p.getValue();
		position = p.getPosition();
		real=0;
		accountrecord = 0;
		committed = false;
		plan=p.getId();
		SubCategory s = p.getSubCategory();
		category = s.getCategory().getId();
		subcategory = s.getId();
	}

	public Assignment toAssignment(PlanRepository planRepository, SubCategoryRepository subCategoryRepository,
			AccountRecordRepository accountRecordRepository) {
		Assignment res = new Assignment();
		res.setId(id);
		res.setShortdescription(detail);
		res.setDescription(description);
		res.setValue(real);
		res.setCommitted(committed);

		if (plan != 0)
			res.setPlan(planRepository.getOne(plan));

		if (accountrecord != 0)
			res.setAccountrecord(accountRecordRepository.getOne(accountrecord));

		if (subcategory != 0) 
			res.setSubCategory(subCategoryRepository.getOne(subcategory));
		return res;
	}
	
	public int compareSubCategory(AssignmentDTO z) {
		int res = Long.compare(position, z.position);
		if (res != 0)
			return res;
		
		return Long.compare(id,z.id);
	}

	public int compareCategory(AssignmentDTO z) {
		int res = Long.compare(subcategory, z.subcategory);
		if (res != 0)
			return res;

		res = Long.compare(position, z.position);
		if (res != 0)
			return res;
		
		return Long.compare(id,z.id);
	}
}
