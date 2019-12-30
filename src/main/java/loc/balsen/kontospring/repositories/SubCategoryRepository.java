package loc.balsen.kontospring.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import loc.balsen.kontospring.data.SubCategory;

public interface SubCategoryRepository extends JpaRepository<SubCategory, Integer>{

	List<SubCategory> findByCategoryId(Integer id);
}
