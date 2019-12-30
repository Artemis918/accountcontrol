package loc.balsen.kontospring.dataservice;

import java.util.List;

import org.springframework.stereotype.Component;

import loc.balsen.kontospring.data.SubCategory;
import loc.balsen.kontospring.data.Category;
import loc.balsen.kontospring.repositories.CategoryRepository;
import loc.balsen.kontospring.repositories.SubCategoryRepository;
import loc.balsen.kontospring.repositories.ZuordnungRepository;


@Component
public class CategoryService {

	private CategoryRepository categoryRepository;
	private SubCategoryRepository subCategoryRepository;
	private ZuordnungRepository assignRepository;

	public CategoryService(CategoryRepository categoryRepository, SubCategoryRepository subCategoryRepository) {
		this.categoryRepository = categoryRepository;
		this.subCategoryRepository = subCategoryRepository;
	}

	public List<Category> getAllCategories() {
		return categoryRepository.findAll();
	}

	public List<SubCategory> getSubCategories(Integer id) {
		return subCategoryRepository.findByCategoryId(id);
	}
	
	public int getAssignCount(Integer id) {
		return assignRepository.countBySubCategory(id);
	}
}
