package loc.balsen.kontospring.dto;

import java.time.LocalDate;
import java.util.Optional;

import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.Plan.MatchStyle;
import loc.balsen.kontospring.data.Template;
import loc.balsen.kontospring.repositories.SubCategoryRepository;
import loc.balsen.kontospring.repositories.TemplateRepository;
import lombok.Data;

@Data
public class PlanDTO {
	
	private int id;
	private LocalDate creationdate;
	private LocalDate startdate;
	private LocalDate plandate;
	private LocalDate enddate;
	private int position;
	private int wert;
	private PatternDTO patterndto;
	private String shortdescription;
	private String description;
	private int matchstyle;
	private int template;
	private int subcategory;
	private int category;
	private String subcategoryname;
	private String categoryname;
	
	public PlanDTO() {
	}
	
	public PlanDTO(Plan plan) {
		this.id=plan.getId();
		this.creationdate=plan.getCreationDate();
		this.startdate=plan.getStartDate();
		this.plandate=plan.getPlanDate();
		this.enddate=plan.getEndDate();
		this.position=plan.getPosition();
		this.wert=plan.getWert();
		this.patterndto=new PatternDTO(plan.getPatternObject());
		this.shortdescription=plan.getShortDescription();
		this.description=plan.getDescription();
		this.matchstyle=plan.getMatchStyle().ordinal();
		this.subcategory=plan.getSubCategory().getId();
		this.category=plan.getSubCategory().getCategory().getId();
		this.subcategoryname=plan.getSubCategory().getShortdescription();
		this.categoryname=plan.getSubCategory().getCategory().getShortdescription();
		
		if(plan.getTemplate() != null)
			this.template=plan.getTemplate().getId();
		else
			this.template = 0;
	}
	
	public Plan toPlan(	TemplateRepository templateRepository, 	SubCategoryRepository subCategoryRepository) {
		Plan plan = new Plan();
		plan.setId(id);
		plan.setCreationDate(creationdate);
		plan.setStartDate(startdate);
		plan.setPlanDate(plandate);
		plan.setEndDate(enddate);
		plan.setPosition(position);
		plan.setWert(wert);
		plan.setPattern(patterndto.toPattern());
		plan.setShortDescription(shortdescription);
		plan.setDescription(description);
		plan.setMatchStyle(MatchStyle.values()[matchstyle]);
		plan.setSubCategory(subCategoryRepository.findById(subcategory).get());
		Optional<Template> otemp = templateRepository.findById(template);
		if (otemp.isPresent())
			plan.setTemplate(otemp.get());
		return plan;
	}
	
	
	
}
