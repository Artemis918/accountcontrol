package loc.balsen.kontospring.repositories;


import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.Template;

public interface PlanRepository extends JpaRepository<Plan, Integer> {
	
	@Query(value = "select max(plan_date) from Plan", nativeQuery = true)
	LocalDate findMaxPlanDate();
	
	@Query(value = "select max(plan_date) from Plan where Plan.template = ?1", nativeQuery=true)
	LocalDate findMaxPlanDateByTemplate(Integer template);

	@Query(value = "select * from Plan p where p.deactivate_date is null and P.template = ?1", nativeQuery=true)	
	List<Plan> findActiveByTemplate(Integer template);

	@Query(value = "select * from Plan where deactivate_date is NULL" +
			       " and (end_date between ?1 and ?2 or start_date between ?1 and ?2 or (start_date <= ?1 and end_date >= ?2))" +
			       " and id not in ( select z.plan from zuordnung z)",nativeQuery=true)
	List<Plan> findByPeriod(LocalDate mindate, LocalDate maxdate);

	List<Plan> findByTemplate(Template template);

}
