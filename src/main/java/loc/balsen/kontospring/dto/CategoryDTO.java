package loc.balsen.kontospring.dto;

import loc.balsen.kontospring.data.Category;

public class CategoryDTO {

  private int id;
  private String shortdescription;
  private String description;

  public CategoryDTO(Category cat) {
    this.id = cat.getId();
    this.description = cat.getDescription();
    this.shortdescription = cat.getShortDescription();
  }

  public Category toCategory() {
    return new Category(id, shortdescription, description);
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
}
