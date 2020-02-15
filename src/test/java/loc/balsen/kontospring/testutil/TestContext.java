package loc.balsen.kontospring.testutil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import loc.balsen.kontospring.Application;
import loc.balsen.kontospring.data.SubCategory;
import loc.balsen.kontospring.data.Category;
import loc.balsen.kontospring.repositories.AccountRecordRepository;
import loc.balsen.kontospring.repositories.CategoryRepository;
import loc.balsen.kontospring.repositories.SubCategoryRepository;
import loc.balsen.kontospring.repositories.PlanRepository;
import loc.balsen.kontospring.repositories.TemplateRepository;
import loc.balsen.kontospring.repositories.AssignmentRepository;

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

			category1 = new Category();
			category2 = new Category();
			category3 = new Category();
			category1.setShortdescription("Category1");
			category2.setShortdescription("Category2");
			category3.setShortdescription("Category3");
			categoryRepository.save(category1);
			categoryRepository.save(category2);
			categoryRepository.save(category3);

			subCategory1 = new SubCategory();
			subCategory2 = new SubCategory();
			subCategory3 = new SubCategory();
			subCategory4 = new SubCategory();
			subCategory5 = new SubCategory();

			subCategory1.setShortdescription("s1shortDesc");
			subCategory2.setShortdescription("s2shortDesc");
			subCategory3.setShortdescription("s3shortDesc");
			subCategory4.setShortdescription("s4shortDesc");
			subCategory5.setShortdescription("s5shortDesc");

			subCategory1.setDescription("s1LangDesc");
			subCategory1.setCategory(category1);
			subCategory2.setCategory(category1);
			subCategory3.setCategory(category1);
			subCategory4.setCategory(category1);
			subCategory5.setCategory(category2);

			subCategoryRepository.save(subCategory1);
			subCategoryRepository.save(subCategory2);
			subCategoryRepository.save(subCategory3);
			subCategoryRepository.save(subCategory4);
			subCategoryRepository.save(subCategory5);
		}
	}
}
