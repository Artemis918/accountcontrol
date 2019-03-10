package loc.balsen.kontospring.repositories;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.Template;

public interface PlanRepository extends JpaRepository<Plan, Integer> {
	
	@Query(value = "select max(plan_date) from Plan", nativeQuery = true)
	LocalDate findMaxPlanDate();

	@Query(value = "select * from Plan p"
	        + " left outer join Zuordnung z on z.plan=p.id"
			+ " where z.id is null"
			+ "   and p.deactivate_date is null"
			+ "   and p.template = ?1", nativeQuery = true)
	List<Plan> findActiveByTemplateNotAssigned(Integer template);

	@Query(value = "select * from Plan p" 
	        + " left outer join Zuordnung z on z.plan=p.id"
			+ " where z.id is null"
			+ " and deactivate_date is NULL"
			+ " and (end_date between ?1 and ?2 or start_date between ?1 and ?2 or (start_date <= ?1 and  end_date >= ?2 ) or match_style=3 )", nativeQuery = true)
	List<Plan> findByPeriodNotAssigned(LocalDate mindate, LocalDate maxdate);

	@Query(value = "select * from Plan where plan_date between ?1 and ?2 and deactivate_date is null order by plan_date", nativeQuery = true)
	List<Plan> findByPlanDate(LocalDate mindate, LocalDate maxdate);

	@Query(value = "select * from Plan p " + " left join Zuordnung z on z.plan=p.id" + " where z.id is null"
			+ " and p.plan_date between ?1 and ?2" + " and p.deactivate_date is null", nativeQuery = true)
	List<Plan> findByPlanDateNotAssigned(LocalDate mindate, LocalDate maxdate);

	List<Plan> findByTemplate(Template template);

	@Query(value = "select * from Plan p where match_style = 3 and deactivate_date is null", nativeQuery = true)
	Collection<Plan> findByPatternPlans();

	@Query(value= "select max(p.plan_date) from Plan p where p.template = ?1" , nativeQuery = true)
	LocalDate findMaxPlanDateByTemplate(Integer templateid);

	@Query(value= "select min(p.plan_date) from Plan p where p.template = ?1" , nativeQuery = true)
	LocalDate findMinPlanDateByTemplate(Integer templateid);

	@Query(value = "select max(p.plan_date) from Plan p" 
	        + " inner join Zuordnung z on z.plan=p.id"
			+ " where p.template = ?1",nativeQuery = true)
	LocalDate findMaxAssignedPlanDateByTemplate(int id);
}
