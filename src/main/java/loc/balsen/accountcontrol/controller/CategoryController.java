package loc.balsen.accountcontrol.controller;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import loc.balsen.accountcontrol.data.Category;
import loc.balsen.accountcontrol.data.SubCategory;
import loc.balsen.accountcontrol.dataservice.CategoryService;
import loc.balsen.accountcontrol.dto.CategoryDTO;
import loc.balsen.accountcontrol.dto.EnumDTO;
import loc.balsen.accountcontrol.dto.MessageID;
import loc.balsen.accountcontrol.dto.SubCategoryDTO;
import loc.balsen.accountcontrol.repositories.CategoryRepository;

@Controller
@RequestMapping("/category")
@ResponseBody
public class CategoryController {

  private CategoryService categoryService;
  private CategoryRepository categoryRepository;

  @Autowired
  public CategoryController(CategoryService categoryService,
      CategoryRepository categoryRepository) {
    this.categoryService = categoryService;
    this.categoryRepository = categoryRepository;
  }

  @GetMapping("/catenum")
  List<EnumDTO> findCategoriesEnum() {
    List<EnumDTO> list = new ArrayList<>();
    for (Category cat : categoryService.getAllCategories())
      list.add(new EnumDTO(cat.getShortDescription(), cat.getId()));
    return list;
  }

  @GetMapping("/subenum/{id}")
  List<EnumDTO> findSubCategoryEnum(@PathVariable Integer id) {
    List<EnumDTO> list = new ArrayList<>();
    for (SubCategory sub : categoryService.getSubCategories(id))
      list.add(new EnumDTO(sub.getShortDescription(), sub.getId()));
    return list;
  }

  @GetMapping("/cat")
  List<CategoryDTO> findCategories() {
    List<CategoryDTO> list = new ArrayList<>();
    for (Category cat : categoryService.getAllCategories())
      list.add(new CategoryDTO(cat));
    return list;
  }

  @GetMapping("/sub/{id}")
  List<SubCategoryDTO> findSubCategory(@PathVariable Integer id) {
    List<SubCategoryDTO> list = new ArrayList<>();
    for (SubCategory sub : categoryService.getSubCategories(id))
      list.add(new SubCategoryDTO(sub));
    return list;
  }

  @PostMapping(path = "/savesub")
  Integer saveSubCategory(@RequestBody SubCategoryDTO request) {
    return Integer
        .valueOf(categoryService.saveSubCategory(request.toSubCategory(categoryRepository)));
  }

  @PostMapping(path = "/savecat")
  Integer saveCategory(@RequestBody CategoryDTO request) {
    return Integer.valueOf(categoryService.saveCategory(request.toCategory()));
  }

  @GetMapping(path = "/delsub/{sub}")
  MessageID delSubCategory(@PathVariable Integer sub) {
    categoryService.delSubCategory(sub);
    return MessageID.ok;
  }

  @GetMapping(path = "/delcat/{cat}")
  MessageID delCategory(@PathVariable Integer cat) {
    categoryService.delCategory(cat);
    return MessageID.ok;
  }
}
