package loc.balsen.accountcontrol.repositories;


import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import loc.balsen.accountcontrol.data.Category;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

  public Optional<Category> findByShortDescription(String shortdescription);
}
