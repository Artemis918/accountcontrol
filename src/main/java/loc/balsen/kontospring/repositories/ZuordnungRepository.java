package loc.balsen.kontospring.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.Zuordnung;

public interface ZuordnungRepository extends JpaRepository<Zuordnung, Integer> {
	
	Zuordnung findByPlan(Plan plan);

}
