package loc.balsen.kontospring.dto;

import java.time.LocalDate;
import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.Plan.MatchStyle;
import loc.balsen.kontospring.data.SubCategory;
import loc.balsen.kontospring.data.Template;
import loc.balsen.kontospring.repositories.SubCategoryRepository;
import loc.balsen.kontospring.repositories.TemplateRepository;

public class PlanDTO {

  private int id;
  private LocalDate creationdate;
  private LocalDate startdate;
  private LocalDate plandate;
  private LocalDate enddate;
  private int position;
  private int value;
  private PatternDTO patterndto;
  private String shortdescription;
  private String description;
  private int matchstyle;
  private int template;
  private int subcategory;
  private int category;
  private String subcategoryname;
  private String categoryname;

  public PlanDTO(Plan plan) {
    this.id = plan.getId();
    this.creationdate = plan.getCreationDate();
    this.startdate = plan.getStartDate();
    this.plandate = plan.getPlanDate();
    this.enddate = plan.getEndDate();
    this.position = plan.getPosition();
    this.value = plan.getValue();
    this.patterndto = new PatternDTO(plan.getPatternObject());
    this.shortdescription = plan.getShortDescription();
    this.description = plan.getDescription();
    this.matchstyle = plan.getMatchStyle().ordinal();
    this.subcategory = plan.getSubCategory().getId();
    this.category = plan.getSubCategory().getCategory().getId();
    this.subcategoryname = plan.getSubCategory().getShortDescription();
    this.categoryname = plan.getSubCategory().getCategory().getShortDescription();

    if (plan.getTemplate() != null)
      this.template = plan.getTemplate().getId();
    else
      this.template = 0;
  }

  public Plan toPlan(TemplateRepository templateRepository,
      SubCategoryRepository subCategoryRepository) {
    SubCategory sub = subCategoryRepository.findById(subcategory).orElseThrow();
    Template temp = templateRepository.findById(template).orElse(null);
    return new Plan(id, creationdate, startdate, plandate, enddate, position, value,
        patterndto.toPattern(), shortdescription, description, MatchStyle.values()[this.matchstyle],
        sub, temp);
  }

  // for serialization only
  //////////////////////////

  PlanDTO() {}

  public int getId() {
    return id;
  }

  public LocalDate getCreationdate() {
    return creationdate;
  }

  public LocalDate getStartdate() {
    return startdate;
  }

  public LocalDate getPlandate() {
    return plandate;
  }

  public LocalDate getEnddate() {
    return enddate;
  }

  public int getPosition() {
    return position;
  }

  public int getValue() {
    return value;
  }

  public PatternDTO getPatterndto() {
    return patterndto;
  }

  public String getShortdescription() {
    return shortdescription;
  }

  public String getDescription() {
    return description;
  }

  public int getMatchstyle() {
    return matchstyle;
  }

  public int getTemplate() {
    return template;
  }

  public int getSubcategory() {
    return subcategory;
  }

  public int getCategory() {
    return category;
  }

  public String getSubcategoryname() {
    return subcategoryname;
  }

  public String getCategoryname() {
    return categoryname;
  }
}
