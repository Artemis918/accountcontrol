package loc.balsen.accountcontrol.data;

import java.time.LocalDate;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Transient;

@Entity
public class Plan {

  public enum MatchStyle {
    EXACT, /// value of record must match
    MAX, /// value of record musn't exxed
    SUMMAX, /// value of record is added to suim but there will be no assignment
    PATTERN /// value is ignored. Just use to automatically assign records to category
  }

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_plan_name")
  @SequenceGenerator(name = "seq_plan_name", sequenceName = "seq_plan", allocationSize = 1)
  private int id;
  private LocalDate creationDate;
  private LocalDate startDate;
  private LocalDate planDate;
  private LocalDate endDate;
  private LocalDate deactivateDate;
  private int position;
  private int value;
  private String shortDescription;
  private String description;
  private MatchStyle matchStyle;

  @Column(nullable = false)
  private String pattern;

  @ManyToOne
  @JoinColumn(name = "template")
  private Template template;

  @ManyToOne
  @JoinColumn(name = "subcategory", nullable = false)
  private SubCategory subCategory;

  @Transient
  private Pattern matcher;

  public Plan() {}

  public Plan(Template templ, LocalDate date) {

    creationDate = LocalDate.now();

    startDate = date.minusDays(templ.getVariance());
    planDate = date;
    endDate = date.plusDays(templ.getVariance());

    subCategory = templ.getSubCategory();
    position = templ.getPosition();
    value = templ.getValue();
    pattern = templ.getPattern();
    shortDescription = templ.getShortDescription();
    description = templ.getDescription();
    matchStyle = templ.getMatchStyle();
    template = templ;

    matcher = null;
  }

  public Plan(int id, LocalDate creationdate, LocalDate startdate, LocalDate plandate,
      LocalDate enddate, int position, int value, Pattern pattern, String shortdescription,
      String description, MatchStyle matchStyle, SubCategory sub, Template temp) {
    this.id = id;
    this.creationDate = (id == 0) ? LocalDate.now() : creationdate;
    this.startDate = startdate;
    this.planDate = plandate;
    this.endDate = enddate;
    this.deactivateDate = null;
    this.position = position;
    this.value = value;
    this.shortDescription = shortdescription;
    this.description = description;
    this.matchStyle = matchStyle;
    this.template = temp;
    this.subCategory = sub;
    if (pattern != null) {
      this.pattern = pattern.toJson();
    }
  }

  public boolean isInPeriod(LocalDate date) {
    return (startDate == null || !date.isBefore(startDate))
        && (endDate == null || !date.isAfter(endDate));
  }

  public boolean matches(AccountRecord record) {
    if (matcher == null)
      matcher = new Pattern(pattern);
    return matcher.matches(record);
  }

  public Pattern getPatternObject() {
    return new Pattern(pattern);
  }

  public void setPattern(Pattern p) {
    pattern = p.toJson();
  }

  public void setMatchStylePattern() {
    startDate = null;
    endDate = null;
    matchStyle = MatchStyle.PATTERN;
    value = 0;
  }

  public void setCreationDate(LocalDate date) {
    this.creationDate = date;
  }

  public void setDates(LocalDate newPlanDate, int newVariance) {
    this.planDate = newPlanDate;
    this.startDate = newPlanDate.minusDays(newVariance);
    this.endDate = newPlanDate.plusDays(newVariance);
  }

  public void deactivate() {
    this.deactivateDate = LocalDate.now();
  }

  public void removeTemplate() {
    this.template = null;
  }

  public int getId() {
    return id;
  }

  public LocalDate getCreationDate() {
    return creationDate;
  }

  public LocalDate getStartDate() {
    return startDate;
  }

  public LocalDate getPlanDate() {
    return planDate;
  }

  public LocalDate getEndDate() {
    return endDate;
  }

  public LocalDate getDeactivateDate() {
    return deactivateDate;
  }

  public int getPosition() {
    return position;
  }

  public int getValue() {
    return value;
  }

  public String getShortDescription() {
    return shortDescription;
  }

  public String getDescription() {
    return description;
  }

  public MatchStyle getMatchStyle() {
    return matchStyle;
  }

  public Template getTemplate() {
    return template;
  }

  public SubCategory getSubCategory() {
    return subCategory;
  }
}
