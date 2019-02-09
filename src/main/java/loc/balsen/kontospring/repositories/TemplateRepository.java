package loc.balsen.kontospring.repositories;

import java.util.Collection;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import loc.balsen.kontospring.data.Template;

public interface TemplateRepository extends JpaRepository<Template, Integer>{

	@Query(value = "select t.* from template t "
			+ "where t.gueltig_bis is null or t.gueltig_bis < current_date"
	       , nativeQuery = true)
	Collection<Template> findValid();

}
