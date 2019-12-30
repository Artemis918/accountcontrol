package loc.balsen.kontospring.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import loc.balsen.kontospring.data.Category;

public interface CategoryRepository extends JpaRepository<Category, Integer>{

}
