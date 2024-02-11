package loc.balsen.accountcontrol.dto;

import loc.balsen.accountcontrol.data.Category;
import loc.balsen.accountcontrol.data.SubCategory;
import loc.balsen.accountcontrol.repositories.CategoryRepository;

public class SubCategoryDTO {

  private int id;
  private String shortdescription;
  private String description;
  private int type;
  private int category;
  private String categoryDesc;
  private boolean favorite;
  private boolean active;;


  public SubCategoryDTO(SubCategory cat) {
    this.id = cat.getId();
    this.description = cat.getDescription();
    this.shortdescription = cat.getShortDescription();
    this.type = cat.getType().ordinal();
    if (cat.getCategory() != null) {
      this.category = cat.getCategory().getId();
      this.categoryDesc = cat.getCategory().getDescription();
    }
    this.active = cat.isActive();
    this.favorite = cat.isFavorite();
  }

  public SubCategory toSubCategory(CategoryRepository categoryRepository) {
    Category cat = categoryRepository.findById(category).orElse(null);
    SubCategory res = new SubCategory(id, shortdescription, description,
        SubCategory.Type.values()[this.type], cat);
    res.setActive(active);
    res.setFavorite(favorite);
    return res;
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

  public boolean isActive() {
    return active;
  }

  public boolean isFavorite() {
    return favorite;
  }

  public String getCategoryDescription() {
    return categoryDesc;
  }
}
