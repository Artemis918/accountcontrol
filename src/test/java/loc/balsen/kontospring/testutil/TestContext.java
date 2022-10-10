package loc.balsen.kontospring.testutil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import loc.balsen.kontospring.Application;
import loc.balsen.kontospring.data.Category;
import loc.balsen.kontospring.data.SubCategory;
import loc.balsen.kontospring.repositories.AccountRecordRepository;
import loc.balsen.kontospring.repositories.AssignmentRepository;
import loc.balsen.kontospring.repositories.CategoryRepository;
import loc.balsen.kontospring.repositories.PlanRepository;
import loc.balsen.kontospring.repositories.SubCategoryRepository;
import loc.balsen.kontospring.repositories.TemplateRepository;

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

    if (categoryRepository.findById(1).isPresent()) {
      category1 = categoryRepository.findById(1).get();
      category2 = categoryRepository.findById(2).get();
      category3 = categoryRepository.findById(3).get();

      subCategory1 = subCategoryRepository.findById(1).get();
      subCategory2 = subCategoryRepository.findById(2).get();
      subCategory3 = subCategoryRepository.findById(3).get();
      subCategory4 = subCategoryRepository.findById(4).get();
      subCategory5 = subCategoryRepository.findById(5).get();
    } else {
      category1 = createCategory(1);
      category2 = createCategory(2);
      category3 = createCategory(3);

      subCategory1 = createSubCategory(1, category1);
      subCategory2 = createSubCategory(2, category1);
      subCategory3 = createSubCategory(3, category1);
      subCategory4 = createSubCategory(4, category1);
      subCategory5 = createSubCategory(5, category2);
    }
  }

  private Category createCategory(int desc) {
    Category cat = new Category(0, "Category " + desc + "short", "Category " + desc + "long");
    categoryRepository.save(cat);
    return cat;
  }

  private SubCategory createSubCategory(int desc, Category cat) {
    SubCategory sub = new SubCategory(0, "SubCat " + desc + "short", "SubCat " + desc + "long",
        SubCategory.Type.INTERN, cat);
    subCategoryRepository.save(sub);
    return sub;
  }
}
