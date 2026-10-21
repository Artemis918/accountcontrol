package loc.balsen.accountcontrol.repositories;

import java.util.Collection;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import loc.balsen.accountcontrol.data.Template;

public interface TemplateRepository extends JpaRepository<Template, Integer> {

  Optional<Template> findById(Integer id);

  @Query(value = "select t.* from template t "
      + "where t.valid_until is null or t.valid_until > current_date", nativeQuery = true)
  Collection<Template> findValid();

}
