package loc.balsen.kontospring.data;

import java.time.LocalDate;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import loc.balsen.kontospring.data.Plan.MatchStyle;

@Entity
public class Template {

  public enum TimeUnit {
    DAY, WEEK, MONTH, YEAR
  }

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_template_name")
  @SequenceGenerator(name = "seq_template_name", sequenceName = "seq_template", allocationSize = 1)
  private int id;
  private LocalDate validFrom;
  private LocalDate validUntil;
  private LocalDate start;
  private int variance;
  private int repeatCount;
  private TimeUnit repeatUnit;
  private String description;
  private int position;
  private int value;
  private String shortDescription;
  private Plan.MatchStyle matchStyle;
  private int next;

  @Column(nullable = false)
  private String pattern;

  @ManyToOne
  @JoinColumn(name = "subcategory", nullable = false)
  private SubCategory subCategory;

  public Template() {}

  public Template(Template t) {
    this.id = t.id;
    this.validFrom = t.validFrom;
    this.validUntil = t.validUntil;
    this.start = t.start;
    this.variance = t.variance;
    this.repeatCount = t.repeatCount;
    this.repeatUnit = t.repeatUnit;
    this.description = t.description;
    this.position = t.position;
    this.value = t.value;
    this.pattern = t.pattern;
    this.shortDescription = t.shortDescription;
    this.matchStyle = t.matchStyle;
    this.next = t.next;
    this.subCategory = t.subCategory;
  }

  public Template(AccountRecord accountRecord, SubCategory sub) {
    LocalDate plandate = accountRecord.getExecuted();
    this.id = 0;
    this.validFrom = plandate;
    this.validUntil = null;
    this.start = plandate;
    this.variance = 4;
    this.repeatCount = 0;
    this.repeatUnit = TimeUnit.MONTH;
    this.description = null;
    this.position = 0;
    this.value = accountRecord.getValue();
    this.pattern = (new Pattern(accountRecord)).toJson();
    this.shortDescription = null;
    this.matchStyle = MatchStyle.EXACT;
    this.next = 0;
    this.subCategory = sub;
  }

  public Template(int id, LocalDate validFrom, LocalDate validUntil, LocalDate start, int variance,
      int repeatcount, TimeUnit repeatunit, String description, int position, int value,
      SubCategory sub, Pattern pattern, String shortdescription, MatchStyle matchStyle, int next) {
    this.id = id;
    this.validFrom = validFrom == null ? LocalDate.now() : validFrom;
    this.validUntil = validUntil;
    this.start = start == null ? LocalDate.now() : start;
    this.variance = variance;
    this.repeatCount = repeatcount;
    this.repeatUnit = repeatunit;
    this.description = description;
    this.position = position;
    this.value = value;
    this.shortDescription = shortdescription;
    this.matchStyle = matchStyle;
    this.next = next;
    this.subCategory = sub;

    if (pattern != null) {
      this.pattern = pattern.toJson();
    }
  }

  public LocalDate increaseDate(LocalDate last) {
    if (last != null) {
      switch (repeatUnit) {
        case DAY:
          return last.plusDays(repeatCount);
        case MONTH:
          return last.plusMonths(repeatCount);
        case WEEK:
          return last.plusWeeks(repeatCount);
        case YEAR:
          return last.plusYears(repeatCount);
      }
    }
    return start;
  }

  public Pattern getPatternObject() {
    return new Pattern(pattern);
  }

  public void setPattern(Pattern p) {
    pattern = p.toJson();
  }

  public Template copyWithNewStart(LocalDate start, LocalDate validFrom, Integer variance) {
    Template result = new Template(this);
    result.start = start;
    result.validFrom = validFrom;
    result.variance = variance;
    return result;
  }

  public Template copyWithNewValue(LocalDate validFrom, int value) {
    Template result = new Template(this);
    result.validFrom = (validFrom);
    result.value = value;
    return result;
  }

  public void setTimeRange(LocalDate newStartDate, int newVariance) {
    this.start = newStartDate;
    this.variance = newVariance;
  }

  public void setValidUntil(LocalDate date) {
    this.validUntil = date;
  }

  public void setValidFrom(LocalDate date) {
    this.validFrom = date;
  }

  public void setValue(int value) {
    this.value = value;
  }

  public void setId(int id) {
    this.id = id;
  }

  public void setNext(int id) {
    this.next = id;
  }

  public boolean equalsExceptValidPeriod(Template t) {
    return this.getId() == t.getId() && this.start.equals(t.start) && this.variance == t.variance
        && this.repeatCount == t.repeatCount && this.repeatUnit == t.repeatUnit
        && this.description.equals(t.description) && this.position == t.position
        && this.value == t.value && this.pattern.equals(t.pattern)
        && this.shortDescription.equals(t.shortDescription) && this.matchStyle == t.matchStyle
        && this.next == t.next && this.subCategory == t.subCategory;
  }

  public int getId() {
    return id;
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

  public int getRepeatCount() {
    return repeatCount;
  }

  public TimeUnit getRepeatUnit() {
    return repeatUnit;
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

  public String getShortDescription() {
    return shortDescription;
  }

  public MatchStyle getMatchStyle() {
    return matchStyle;
  }

  public int getNext() {
    return next;
  }

  public String getPattern() {
    return pattern;
  }

  public SubCategory getSubCategory() {
    return subCategory;
  }
}
