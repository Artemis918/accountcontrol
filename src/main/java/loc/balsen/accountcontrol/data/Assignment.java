package loc.balsen.kontospring.data;

import java.time.LocalDate;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;

@Entity
public class Assignment {

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_assignment_name")
  @SequenceGenerator(name = "seq_assignment_name", sequenceName = "seq_assignment",
      allocationSize = 1)
  private int id;

  private int value;
  private String shortDescription;
  @SuppressWarnings("unused")
  private String description;
  private boolean committed;

  @OneToOne
  @JoinColumn(name = "plan")
  private Plan plan;

  @OneToOne
  @JoinColumn(name = "accountrecord")
  private AccountRecord accountrecord;

  @ManyToOne
  @JoinColumn(name = "subcategory")
  private SubCategory subCategory;

  public Assignment() {}

  public Assignment(int value, Plan plan, AccountRecord record) {
    this.id = 0;
    this.value = value;
    this.shortDescription = plan.getShortDescription();
    this.description = plan.getDescription();
    this.committed = false;
    this.accountrecord = record;
    this.subCategory = plan.getSubCategory();

    if (plan.getMatchStyle() != Plan.MatchStyle.PATTERN) {
      this.plan = plan;
    }
  }

  public Assignment(Plan plan, AccountRecord record) {
    this.id = 0;
    this.value = record.getValue();
    this.shortDescription = plan.getShortDescription();
    this.description = plan.getDescription();
    this.committed = false;
    this.plan = plan;
    this.accountrecord = record;
    this.subCategory = plan.getSubCategory();
  }

  public Assignment(int id, String shortDescription, String description, boolean committed,
      Plan plan, AccountRecord record, int value, SubCategory subCategory) {
    this.id = id;
    this.value = value;
    this.shortDescription = shortDescription;
    this.description = description;
    this.committed = committed;
    this.plan = plan;
    this.accountrecord = record;
    this.subCategory = subCategory;
  }

  public Assignment(String shortDescription, String description, SubCategory sub,
      AccountRecord record, Plan plan) {
    this.id = 0;
    this.value = record.getValue();
    this.shortDescription = shortDescription;
    this.description = description;
    this.committed = false;
    this.plan = plan;
    this.accountrecord = record;
    this.subCategory = sub;
  }

  public void setCommitted(boolean committed) {
    this.committed = committed;
  }

  public Double getNaturalValue() {
    double res = value;
    res /= 100;
    return res;
  }

  public void setNatural(Double val) {
    val *= 100;
    value = (val.intValue());
  }

  public LocalDate getStatsDay() {
    return plan == null ? getAccountrecord().getExecuted() : plan.getPlanDate();
  }

  public int getId() {
    return id;
  }

  public int getValue() {
    return value;
  }

  public String getShortDescription() {
    return shortDescription;
  }

  // TODO description

  public boolean isCommitted() {
    return committed;
  }

  public Plan getPlan() {
    return plan;
  }

  public AccountRecord getAccountrecord() {
    return accountrecord;
  }

  public SubCategory getSubCategory() {
    return subCategory;
  }
}
