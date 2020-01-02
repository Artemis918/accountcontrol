package loc.balsen.kontospring.dataservice;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Component;

import loc.balsen.kontospring.data.Category;
import loc.balsen.kontospring.data.SubCategory;
import loc.balsen.kontospring.repositories.CategoryRepository;
import loc.balsen.kontospring.repositories.SubCategoryRepository;


@Component
public class CategoryService {

	private static final int ERROR_NOCATEGORY = -2;
	private static final int ERROR_DOUBLE = -1;
	
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

	public int saveSubCategory(SubCategory subCategory) {
		
		if (subCategory.getCategory()==null) {
			return ERROR_NOCATEGORY;
		}
		
		Optional<SubCategory> sub = 
				subCategoryRepository.findByCategoryAndShortdescription(subCategory.getCategory(),subCategory.getShortdescription());
		if (sub.isPresent() && sub.get().getId()  != subCategory.getId()) {
			return ERROR_DOUBLE;
		}
		
		SubCategory toSave = subCategory;
		if ( subCategory.getId() != 0) {
			sub = subCategoryRepository.findById(subCategory.getId());

			if (sub.isPresent()) {
				toSave = sub.get();
				toSave.setDescription(subCategory.getDescription());
				toSave.setShortdescription(subCategory.getShortdescription());
			}
		}

		subCategoryRepository.save(toSave);

		return subCategory.getId();
	}

	public int saveCategory(Category category) {
		Optional<Category> cat = 
				categoryRepository.findByShortdescription(category.getShortdescription());
		if (cat.isPresent() && cat.get().getId()  != category.getId()) {
			return ERROR_DOUBLE;
		}
	
		Category toSave = category;
		if ( category.getId() != 0) {
			cat = categoryRepository.findById(category.getId());

			if (cat.isPresent()) {
				toSave = cat.get();
				toSave.setDescription(category.getDescription());
				toSave.setShortdescription(category.getShortdescription());
			}
		}
		categoryRepository.save(toSave);
		return category.getId();
	}
}
