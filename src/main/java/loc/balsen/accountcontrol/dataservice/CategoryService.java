package loc.balsen.accountcontrol.dataservice;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Component;
import loc.balsen.accountcontrol.data.Category;
import loc.balsen.accountcontrol.data.SubCategory;
import loc.balsen.accountcontrol.repositories.CategoryRepository;
import loc.balsen.accountcontrol.repositories.SubCategoryRepository;

@Component
public class CategoryService {

  private static final int ERROR_NOCATEGORY = -2;
  private static final int ERROR_DOUBLE = -1;

  private CategoryRepository categoryRepository;
  private SubCategoryRepository subCategoryRepository;
  private AssignmentService assignService;

  public CategoryService(CategoryRepository categoryRepository,
      SubCategoryRepository subCategoryRepository, AssignmentService assignmentService) {
    this.assignService = assignmentService;
    this.categoryRepository = categoryRepository;
    this.subCategoryRepository = subCategoryRepository;
  }

  public List<Category> getAllCategories(boolean activeOnly) {
    if (!activeOnly)
      return categoryRepository.findAllByOrderByShortDescription();
    else
      return categoryRepository.findAllByOrderByShortDescription().stream()
          .filter(Category::isActive).toList();
  }

  public List<SubCategory> getSubCategories(int id, boolean activeonly) {
    if (!activeonly)
      return subCategoryRepository.findByCategoryIdOrderByShortDescription(id);
    else
      return subCategoryRepository.findByCategoryIdOrderByShortDescription(id).stream()
          .filter(SubCategory::isActive).toList();
  }

  public List<SubCategory> getFavoriteSubCategories() {
    return subCategoryRepository.findAllByOrderByShortDescription().stream()
        .filter(SubCategory::isFavorite).toList();
  }

  public int saveSubCategory(SubCategory subCategory) {

    if (subCategory.getCategory() == null) {
      return ERROR_NOCATEGORY;
    }

    Optional<SubCategory> sub = subCategoryRepository.findByCategoryAndShortDescription(
        subCategory.getCategory(), subCategory.getShortDescription());
    if (sub.isPresent() && sub.get().getId() != subCategory.getId()) {
      return ERROR_DOUBLE;
    }

    SubCategory toSave = subCategory;
    if (subCategory.getId() != 0) {
      sub = subCategoryRepository.findById(subCategory.getId());

      if (sub.isPresent()) {
        toSave = sub.get();
        toSave.setDescription(subCategory.getShortDescription(), subCategory.getDescription());
      }
    }

    subCategoryRepository.save(toSave);

    return subCategory.getId();
  }

  public int saveCategory(Category category) {
    Optional<Category> cat =
        categoryRepository.findByShortDescription(category.getShortDescription());
    if (cat.isPresent() && cat.get().getId() != category.getId()) {
      return ERROR_DOUBLE;
    }

    Category toSave = category;
    if (category.getId() != 0) {
      cat = categoryRepository.findById(category.getId());

      if (cat.isPresent()) {
        toSave = cat.get();
        toSave.setDescription(category.getShortDescription(), category.getDescription());
      }
    }
    categoryRepository.save(toSave);
    return category.getId();
  }

  public void delSubCategory(int subCategory) {
    assignService.deleteBySubCategoryId(subCategory);
    subCategoryRepository.deleteById(subCategory);
  }

  public void delCategory(int category) {
    List<SubCategory> subs =
        subCategoryRepository.findByCategoryIdOrderByShortDescription(category);
    for (SubCategory sub : subs) {
      delSubCategory(sub.getId());
    }
    categoryRepository.deleteById(category);
  }

  public void invertActiveCat(Integer cat) {
    Optional<Category> catentry = categoryRepository.findById(cat);
    if (catentry.isPresent()) {
      Category category = catentry.get();
      category.setActive(!category.isActive());
      categoryRepository.save(category);
    }
  }

  public void invertActiveSubCat(Integer subcat) {
    Optional<SubCategory> subentry = subCategoryRepository.findById(subcat);
    if (subentry.isPresent()) {
      SubCategory subCategory = subentry.get();
      subCategory.setActive(!subCategory.isActive());
      subCategoryRepository.save(subCategory);
    }
  }

  public void invertFavoriteSubCat(Integer subcat) {
    Optional<SubCategory> subentry = subCategoryRepository.findById(subcat);
    if (subentry.isPresent()) {
      SubCategory subCategory = subentry.get();
      subCategory.setFavorite(!subCategory.isFavorite());
      subCategoryRepository.save(subCategory);
    }
  }


}
