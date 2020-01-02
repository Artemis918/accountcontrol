package loc.balsen.kontospring.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import loc.balsen.kontospring.data.Category;
import loc.balsen.kontospring.data.SubCategory;

public interface CategoryRepository extends JpaRepository<Category, Integer>{

	Optional<Category> findByShortdescription(String shortdescription);
}
