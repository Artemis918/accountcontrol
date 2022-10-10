package loc.balsen.accountcontrol.dto;

import loc.balsen.accountcontrol.data.AccountRecord;
import loc.balsen.accountcontrol.data.Assignment;
import loc.balsen.accountcontrol.data.Plan;
import loc.balsen.accountcontrol.data.SubCategory;
import loc.balsen.accountcontrol.repositories.AccountRecordRepository;
import loc.balsen.accountcontrol.repositories.PlanRepository;
import loc.balsen.accountcontrol.repositories.SubCategoryRepository;

public class AssignmentDTO {

  private int id;
  private String detail;
  private String description;
  private int planed;
  private int real;
  private boolean committed;
  private int plan;
  private int accountrecord;
  private int subcategory;
  private int category;
  private int position;

  public AssignmentDTO(Assignment z) {
    id = z.getId();
    detail = z.getShortDescription();
    real = z.getValue();
    accountrecord = z.getAccountrecord().getId();
    setCommitted(z.isCommitted());
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
    real = 0;
    accountrecord = 0;
    setCommitted(false);
    plan = p.getId();
    SubCategory s = p.getSubCategory();
    category = s.getCategory().getId();
    subcategory = s.getId();
  }

  public Assignment toAssignment(PlanRepository planRepository,
      SubCategoryRepository subCategoryRepository,
      AccountRecordRepository accountRecordRepository) {

    Plan plan = (this.plan == 0) ? null : planRepository.findById(this.plan).orElseThrow();
    AccountRecord record = (this.accountrecord == 0) ? null
        : accountRecordRepository.findById(accountrecord).orElseThrow();
    SubCategory sub =
        (subcategory == 0) ? null : subCategoryRepository.findById(subcategory).orElseThrow();

    return new Assignment(id, detail, description, committed, plan, record, real, sub);
  }

  public int comparePosition(AssignmentDTO z) {
    int res = Long.compare(position, z.position);
    if (res != 0)
      return res;

    return Long.compare(id, z.id);
  }

  public int compareCategory(AssignmentDTO z) {
    int res = Long.compare(subcategory, z.subcategory);
    if (res != 0)
      return res;

    res = Long.compare(position, z.position);
    if (res != 0)
      return res;

    return Long.compare(id, z.id);
  }

  public int getReal() {
    return real;
  }

  // only for serialization
  ////////////////////////////
  public int getId() {
    return id;
  }

  public String getDetail() {
    return detail;
  }

  public String getDescription() {
    return description;
  }

  public int getPlaned() {
    return planed;
  }

  public boolean isCommitted() {
    return committed;
  }

  public void setCommitted(boolean committed) {
    this.committed = committed;
  }

  public int getPlan() {
    return plan;
  }

  public int getAccountrecord() {
    return accountrecord;
  }

  public int getSubcategory() {
    return subcategory;
  }

  public int getCategory() {
    return category;
  }

  public int getPosition() {
    return position;
  }
}
