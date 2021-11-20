package loc.balsen.kontospring.dto;

import java.time.LocalDate;

import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.Template;
import loc.balsen.kontospring.data.Template.TimeUnit;
import loc.balsen.kontospring.repositories.SubCategoryRepository;
import lombok.Data;

@Data
public class TemplateDTO {
	private int id;
	private LocalDate validFrom;
	private LocalDate validUntil;
	private LocalDate start;
	private int variance;
	private int repeatcount;
	private int repeatunit;
	private int subcategory;
	private int category;
	private String subcategoryname;
	private String categoryname;
	private String description;
	private int position;
	private int value;
	private PatternDTO pattern;
	private String shortdescription;
	private int matchstyle;
	private int previous;	
	private String additional;

	public TemplateDTO() {
	}
	
	public TemplateDTO(Template template) {
				
		this.id = template.getId();
		this.validFrom = template.getValidFrom();
		this.validUntil = template.getValidUntil();
		this.start = template.getStart();
		this.variance=template.getVariance();
		this.repeatcount = template.getRepeatCount();
		this.repeatunit = template.getRepeatUnit().ordinal();
		this.description = template.getDescription();
		this.position= template.getPosition();
		this.subcategory=template.getSubCategory().getId();
		this.category=template.getSubCategory().getCategory().getId();
		this.subcategoryname=template.getSubCategory().getShortdescription();
		this.categoryname=template.getSubCategory().getCategory().getShortdescription();
		this.value = template.getValue();
		this.pattern = new PatternDTO(template.getPatternObject());
		this.shortdescription = template.getShortDescription();
		this.matchstyle = template.getMatchStyle().ordinal();
		this.previous = template.getNext();
		this.additional = "";
	}
	
	public Template toTemplate(SubCategoryRepository subCategoryRepository) {
		Template template = new Template();

		template.setId(this.getId());
		template.setValidFrom(this.validFrom == null ? LocalDate.now(): this.validFrom);
		template.setValidUntil(this.validUntil);
		template.setStart(this.start == null ? LocalDate.now() : this.start);
		template.setVariance(this.variance);
		template.setRepeatCount(this.repeatcount);
		template.setRepeatUnit(TimeUnit.values()[this.repeatunit]);
		template.setDescription(this.description);
		template.setPosition(this.position);
		template.setValue(this.value);
		template.setSubCategory(subCategoryRepository.findById(this.subcategory).orElseThrow());
		template.setPattern(pattern.toPattern());
		template.setShortDescription(this.shortdescription);
		template.setMatchStyle(Plan.MatchStyle.values()[this.matchstyle]);
		template.setNext(this.getPrevious());
		return template;
	}
	

}
