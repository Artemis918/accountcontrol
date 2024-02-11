package loc.balsen.accountcontrol.dto;

import loc.balsen.accountcontrol.data.Category;

public class CategoryDTO {

  private int id;
  private String shortdescription;
  private String description;
  private boolean active;


  public CategoryDTO() {};

  public CategoryDTO(Category cat) {
    this.id = cat.getId();
    this.description = cat.getDescription();
    this.shortdescription = cat.getShortDescription();
    this.active = cat.isActive();
  }

  public Category toCategory() {
    Category res = new Category(id, shortdescription, description);
    res.setActive(active);
    return res;
  }

  // for serialization only
  //////////////////////////////// 7
  public int getId() {
    return id;
  }

  public String getShortdescription() {
    return shortdescription;
  }

  public String getDescription() {
    return description;
  }

  public boolean isActive() {
    return active;
  }
}
