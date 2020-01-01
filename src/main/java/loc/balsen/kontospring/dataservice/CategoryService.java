package loc.balsen.kontospring.dataservice;

import java.util.List;

import org.springframework.stereotype.Component;

import loc.balsen.kontospring.data.Category;
import loc.balsen.kontospring.data.SubCategory;
import loc.balsen.kontospring.repositories.CategoryRepository;
import loc.balsen.kontospring.repositories.SubCategoryRepository;


@Component
public class CategoryService {

	private CategoryRepository categoryRepository;
	private SubCategoryRepository subCategoryRepository;

	public CategoryService(CategoryRepository categoryRepository, SubCategoryRepository subCategoryRepository) {
		this.categoryRepository = categoryRepository;
		this.subCategoryRepository = subCategoryRepository;
	}

	public List<Category> getAllCategories() {
		return categoryRepository.findAll();
	}

	public List<SubCategory> getSubCategories(int id) {
		return subCategoryRepository.findByCategoryId(id);
	}

	public int addSubCategory(SubCategory subCategory) {
		if (subCategoryRepository.findByCategoryAndShortdescription(subCategory.getCategory(),subCategory.getShortdescription()).isPresent()) {
			return -2;
		}
		
		if (subCategory.getCategory()==null) {
			return -1;
		}
		
		subCategoryRepository.save(subCategory);
		
		return subCategory.getId();
	}
}
