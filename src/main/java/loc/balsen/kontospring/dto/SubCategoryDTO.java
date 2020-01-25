package loc.balsen.kontospring.dto;

import java.util.Optional;

import loc.balsen.kontospring.data.Category;
import loc.balsen.kontospring.data.SubCategory;
import loc.balsen.kontospring.repositories.CategoryRepository;
import lombok.Data;

@Data
public class SubCategoryDTO {

	public SubCategoryDTO() {
	}

	public SubCategoryDTO(SubCategory cat ) {
		this.id = cat.getId();
		this.description = cat.getDescription();
		this.shortdescription = cat.getShortdescription();
		this.type = cat.getType();
		if (cat.getCategory() != null)
			this.category =  cat.getCategory().getId();
	}

	public SubCategory toSubCategory(CategoryRepository categoryRepository) {
		SubCategory sub= new SubCategory();
		sub.setId(id);
		sub.setShortdescription(shortdescription);
		sub.setDescription(description);
		sub.setType(type);
		if (category != 0) {
			Optional<Category> cat = categoryRepository.findById(category);
			sub.setCategory(cat.isPresent() ? cat.get():null);			
		}
		return sub;
	}
	
	private int id;
	private String shortdescription;
	private String description;
	private int type;
	private int category;
}
