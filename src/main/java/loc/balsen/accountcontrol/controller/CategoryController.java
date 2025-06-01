package loc.balsen.accountcontrol.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
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

  @GetMapping("/catenum/{activeonly}")
  List<EnumDTO> findCategoriesEnum(@PathVariable boolean activeonly) {
    return categoryService.getAllCategories(activeonly).stream().map(cat -> {
      return new EnumDTO(cat.getShortDescription(), cat.getId());
    }).toList();
  }

  @GetMapping("/subenumfavorite")
  List<EnumDTO> findFavoriteSubCategoriesEnum() {
    return categoryService.getFavoriteSubCategories().stream().map(sub -> {
      String text = sub.getCategory().getShortDescription() + "/" + sub.getShortDescription();
      return new EnumDTO(text, sub.getId());
    }).toList();
  }


  @GetMapping("/subenum/{id}/{activeonly}")
  List<EnumDTO> findSubCategoryEnum(@PathVariable Integer id, @PathVariable boolean activeonly) {
    return categoryService.getSubCategories(id, activeonly).stream().map(sub -> {
      return new EnumDTO(sub.getShortDescription(), sub.getId());
    }).toList();
  }

  @GetMapping("/cat")
  List<CategoryDTO> findCategories() {
    return categoryService.getAllCategories(false).stream().map(cat -> {
      return new CategoryDTO(cat);
    }).toList();
  }

  @GetMapping("/sub/{id}")
  List<SubCategoryDTO> findSubCategory(@PathVariable Integer id) {
    return categoryService.getSubCategories(id, false).stream().map(sub -> {
      return new SubCategoryDTO(sub);
    }).toList();
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

  @GetMapping(path = "/invertactivecat/{cat}")
  MessageID invertCategoryActive(@PathVariable Integer cat) {
    categoryService.invertActiveCat(cat);
    return MessageID.ok;
  }

  @GetMapping(path = "/invertactivesub/{subcat}")
  MessageID invertSubCategoryActive(@PathVariable Integer subcat) {
    categoryService.invertActiveSubCat(subcat);
    return MessageID.ok;
  }

  @GetMapping(path = "/invertfavorite/{subcat}")
  MessageID invertSubCategoryFavorite(@PathVariable Integer subcat) {
    categoryService.invertFavoriteSubCat(subcat);
    return MessageID.ok;
  }

}
