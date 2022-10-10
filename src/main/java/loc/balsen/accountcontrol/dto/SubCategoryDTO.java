package loc.balsen.kontospring.dto;

import loc.balsen.kontospring.data.Category;
import loc.balsen.kontospring.data.SubCategory;
import loc.balsen.kontospring.repositories.CategoryRepository;

public class SubCategoryDTO {

  private int id;
  private String shortdescription;
  private String description;
  private int type;
  private int category;


  public SubCategoryDTO(SubCategory cat) {
    this.id = cat.getId();
    this.description = cat.getDescription();
    this.shortdescription = cat.getShortDescription();
    this.type = cat.getType().ordinal();
    if (cat.getCategory() != null)
      this.category = cat.getCategory().getId();
  }

  public SubCategory toSubCategory(CategoryRepository categoryRepository) {
    Category cat = categoryRepository.findById(category).orElse(null);
    return new SubCategory(id, shortdescription, description, SubCategory.Type.values()[this.type],
        cat);
  }

  // for serialization only
  ////////////////////////////
  public SubCategoryDTO() {}

  public int getId() {
    return id;
  }

  public String getShortdescription() {
    return shortdescription;
  }

  public String getDescription() {
    return description;
  }

  public int getType() {
    return type;
  }

  public int getCategory() {
    return category;
  }
}
