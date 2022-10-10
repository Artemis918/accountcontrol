package loc.balsen.kontospring.dto;

import java.time.LocalDate;
import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.SubCategory;
import loc.balsen.kontospring.data.Template;
import loc.balsen.kontospring.data.Template.TimeUnit;
import loc.balsen.kontospring.repositories.SubCategoryRepository;

public class TemplateDTO {
  private int id;
  private LocalDate validFrom;
  private LocalDate validUntil;
  private LocalDate start;
  private int variance;
  private int repeatcount;
  private int repeatunit;
  private int subcategory;

  private String description;
  private int position;
  private int value;
  private PatternDTO pattern;
  private String shortdescription;
  private int matchstyle;
  private int previous;

  private int category;
  private String subcategoryname;
  private String categoryname;
  private String additional;

  public TemplateDTO() {}

  public TemplateDTO(Template template) {
    copyTemplate(template);
  }

  public TemplateDTO(Template template, String additional, LocalDate executed) {

    if (template != null)
      copyTemplate(template);

    this.additional = additional;
    // Here i reused that date for another context.
    // Should be changed some day
    this.start = executed;
  }

  private void copyTemplate(Template template) {
    this.id = template.getId();
    this.validFrom = template.getValidFrom();
    this.validUntil = template.getValidUntil();
    this.start = template.getStart();
    this.variance = template.getVariance();
    this.repeatcount = template.getRepeatCount();
    this.repeatunit = template.getRepeatUnit().ordinal();
    this.description = template.getDescription();
    this.position = template.getPosition();
    this.subcategory = template.getSubCategory().getId();
    this.category = template.getSubCategory().getCategory().getId();
    this.subcategoryname = template.getSubCategory().getShortDescription();
    this.categoryname = template.getSubCategory().getCategory().getShortDescription();
    this.value = template.getValue();
    this.pattern = new PatternDTO(template.getPatternObject());
    this.shortdescription = template.getShortDescription();
    this.matchstyle = template.getMatchStyle().ordinal();
    this.previous = template.getNext();
    this.additional = "";
  }

  public Template toTemplate(SubCategoryRepository subCategoryRepository) {

    if (this.repeatcount <= 0) {
      return null;
    }

    SubCategory sub = subCategoryRepository.findById(subcategory).orElseThrow();

    return new Template(id, validFrom, validUntil, start, variance, repeatcount,
        (TimeUnit.values()[repeatunit]), description, position, value, sub, pattern.toPattern(),
        shortdescription, Plan.MatchStyle.values()[matchstyle], previous);
    // TODO why previous is next?
  }

  // for serialization only
  ////////////////////////////// 7

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

  public LocalDate getValidFrom() {
    return validFrom;
  }

  public LocalDate getValidUntil() {
    return validUntil;
  }

  public LocalDate getStart() {
    return start;
  }

  public int getVariance() {
    return variance;
  }

  public int getRepeatcount() {
    return repeatcount;
  }

  public int getRepeatunit() {
    return repeatunit;
  }

  public int getSubcategory() {
    return subcategory;
  }

  public String getDescription() {
    return description;
  }

  public int getPosition() {
    return position;
  }

  public int getValue() {
    return value;
  }

  public PatternDTO getPattern() {
    return pattern;
  }

  public String getShortdescription() {
    return shortdescription;
  }

  public void setShortdescription(String shortdescription) {
    this.shortdescription = shortdescription;
  }

  public int getMatchstyle() {
    return matchstyle;
  }

  public int getPrevious() {
    return previous;
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

  public String getAdditional() {
    return additional;
  }
}
