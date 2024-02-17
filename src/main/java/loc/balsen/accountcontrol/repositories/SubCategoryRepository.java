package loc.balsen.accountcontrol.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import loc.balsen.accountcontrol.data.Category;
import loc.balsen.accountcontrol.data.SubCategory;

public interface SubCategoryRepository extends JpaRepository<SubCategory, Integer> {

  List<SubCategory> findByCategoryIdOrderByShortDescription(Integer id);

  Optional<SubCategory> findByCategoryAndShortDescription(Category category,
      String shortdescription);
}
