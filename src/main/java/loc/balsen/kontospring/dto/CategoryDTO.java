package loc.balsen.kontospring.dto;

import loc.balsen.kontospring.data.Category;
import lombok.Data;

@Data
public class CategoryDTO {

	public CategoryDTO() {
	}

	public CategoryDTO(Category cat ) {
		this.id = cat.getId();
		this.description = cat.getDescription();
		this.shortdescription = cat.getShortdescription();
	}

	public Category toCategory() {
		Category cat= new Category();
		cat.setId(id);
		cat.setShortdescription(shortdescription);
		cat.setDescription(description);
		return cat;
	}
	
	private int id;
	private String shortdescription;
	private String description;
}
