package loc.balsen.kontospring.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import loc.balsen.kontospring.controller.ZuordnungController.ToCategoryRequestDTO;
import loc.balsen.kontospring.data.Category;
import loc.balsen.kontospring.data.SubCategory;
import loc.balsen.kontospring.dataservice.CategoryService;
import loc.balsen.kontospring.dto.CategoryDTO;
import loc.balsen.kontospring.dto.EnumDTO;
import loc.balsen.kontospring.dto.SubCategoryDTO;
import loc.balsen.kontospring.repositories.CategoryRepository;
import loc.balsen.kontospring.repositories.SubCategoryRepository;
import lombok.Data;

@Controller
@RequestMapping("/category")
public class CategoryController {
	
	private CategoryService categoryService;
	private CategoryRepository categoryRepository;
	
	@Autowired
	public CategoryController(CategoryService categoryService, CategoryRepository categoryRepository) {
		this.categoryService = categoryService;
		this.categoryRepository = categoryRepository;
	}
	
	@GetMapping("/catenum")
	@ResponseBody
	List<EnumDTO> findCategoriesEnum() {
		List<EnumDTO> list = new ArrayList<>();
		for(Category cat: categoryService.getAllCategories())
			list.add(new EnumDTO(cat.getShortdescription(), cat.getId()));
		return list;
	}
	
	@GetMapping("/subenum/{id}")
	@ResponseBody
	List<EnumDTO> findSubCategoryEnum(@PathVariable Integer id) {
		List<EnumDTO> list = new ArrayList<>();
		for(SubCategory sub: categoryService.getSubCategories(id))
			list.add(new EnumDTO(sub.getShortdescription(), sub.getId()));
		return list;
	}
	
	@GetMapping("/cat")
	@ResponseBody
	List<CategoryDTO> findCategories() {
		List<CategoryDTO> list = new ArrayList<>();
		for(Category cat: categoryService.getAllCategories())
			list.add(new CategoryDTO(cat));
		return list;
	}
	
	@GetMapping("/sub/{id}")
	@ResponseBody
	List<SubCategoryDTO> findSubCategory(@PathVariable Integer id) {
		List<SubCategoryDTO> list = new ArrayList<>();
		for(SubCategory sub: categoryService.getSubCategories(id))
			list.add(new SubCategoryDTO(sub));
		return list;
	}
	
	@PostMapping(path="/savesub",produces = MediaType.TEXT_PLAIN_VALUE)
	@ResponseBody
	String saveSubCategory(@RequestBody SubCategoryDTO request) {
		return Integer.toString(categoryService.saveSubCategory(request.toSubCategory(categoryRepository)));
	}
	
	@PostMapping(path="/savecat",produces = MediaType.TEXT_PLAIN_VALUE)
	@ResponseBody
	String saveCategory(@RequestBody CategoryDTO request) {
		return Integer.toString(categoryService.saveCategory(request.toCategory()));
	}
	
	@GetMapping(path="/delsub/{sub}")
	@ResponseBody
	StandardResult delSubCategory(@PathVariable Integer sub) {
		categoryService.delSubCategory(sub);
		return new StandardResult(false, "OK");
	}
	
	@GetMapping(path="/delcat/{cat}")
	@ResponseBody
	StandardResult delCategory(@PathVariable Integer cat) {
		categoryService.delCategory(cat);
		return new StandardResult(false, "OK");
	}	

}
