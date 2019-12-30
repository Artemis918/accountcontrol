package loc.balsen.kontospring.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import loc.balsen.kontospring.data.SubCategory;
import loc.balsen.kontospring.data.Category;
import loc.balsen.kontospring.dataservice.CategoryService;
import loc.balsen.kontospring.dataservice.StatsService;
import loc.balsen.kontospring.dto.EnumDTO;
import lombok.Data;

@Controller
@RequestMapping("/category")
public class CategoryController {
	
	private CategoryService categoryService;
	
	@Autowired
	public CategoryController(CategoryService categoryService) {
		this.categoryService = categoryService;
	}
	
	@GetMapping("/cat")
	@ResponseBody
	List<EnumDTO> findCategories() {
		List<EnumDTO> list = new ArrayList<>();
		for(Category cat: categoryService.getAllCategories())
			list.add(new EnumDTO(cat.getShortdescription(), cat.getId()));
		return list;
	}
	
	@GetMapping("/sub/{id}")
	@ResponseBody
	List<EnumDTO> findSubCategory(@PathVariable Integer id) {
		List<EnumDTO> list = new ArrayList<>();
		for(SubCategory sub: categoryService.getSubCategories(id))
			list.add(new EnumDTO(sub.getShortdescription(), sub.getId()));
		return list;
	}
	
	@GetMapping("assigns/{id}")
	@ResponseBody
	Integer countAssignForSubCategory(@PathVariable Integer id) {
		return new Integer(categoryService.getAssignCount(id));
	}
}
