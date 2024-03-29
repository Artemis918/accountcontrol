package loc.balsen.accountcontrol.testutil;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import loc.balsen.accountcontrol.Application;
import loc.balsen.accountcontrol.data.Category;
import loc.balsen.accountcontrol.data.SubCategory;
import loc.balsen.accountcontrol.repositories.AccountRecordRepository;
import loc.balsen.accountcontrol.repositories.AssignmentRepository;
import loc.balsen.accountcontrol.repositories.CategoryRepository;
import loc.balsen.accountcontrol.repositories.PlanRepository;
import loc.balsen.accountcontrol.repositories.SubCategoryRepository;
import loc.balsen.accountcontrol.repositories.TemplateRepository;

@SpringBootTest(classes = Application.class)
public class TestContext {

  @Autowired
  protected TemplateRepository templateRepository;

  @Autowired
  protected PlanRepository planRepository;

  @Autowired
  protected CategoryRepository categoryRepository;

  @Autowired
  protected SubCategoryRepository subCategoryRepository;

  @Autowired
  protected AssignmentRepository assignmentRepository;

  @Autowired
  protected AccountRecordRepository accountRecordRepository;

  protected SubCategory subCategory1;
  protected SubCategory subCategory2;
  protected SubCategory subCategory3;
  protected SubCategory subCategory4;
  protected SubCategory subCategory5;

  protected Category category1;
  protected Category category2;
  protected Category category3;

  public void clearRepos() {
    assignmentRepository.deleteAll();
    accountRecordRepository.deleteAll();
    planRepository.deleteAll();
    templateRepository.deleteAll();
  }

  protected void createCategoryData() {

    category1 = createCategory(1, true);
    category2 = createCategory(2, false);
    category3 = createCategory(3, true);

    subCategory1 = createSubCategory(1, category1, true, false);
    subCategory2 = createSubCategory(2, category1, false, true);
    subCategory3 = createSubCategory(3, category1, true, true);
    subCategory4 = createSubCategory(4, category1, true, false);
    subCategory5 = createSubCategory(5, category2, false, false);
  }

  private Category createCategory(int desc, boolean active) {
    Optional<Category> optcat = categoryRepository.findById(desc);
    if (optcat.isPresent()) {
      return optcat.get();
    } else {
      Category cat = new Category(0, "Category " + desc + "short", "Category " + desc + "long");
      cat.setActive(active);
      categoryRepository.save(cat);
      return cat;
    }
  }

  private SubCategory createSubCategory(int desc, Category cat, boolean active, boolean favorite) {
    if (subCategoryRepository.findById(desc).isPresent()) {
      return subCategoryRepository.findById(desc).get();
    } else {
      SubCategory sub = new SubCategory(0, "SubCat " + desc + "short", "SubCat " + desc + "long",
          SubCategory.Type.INTERN, cat);
      sub.setActive(active);
      sub.setFavorite(favorite);
      subCategoryRepository.save(sub);
      return sub;
    }
  }
}
