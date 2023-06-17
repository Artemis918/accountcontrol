package loc.balsen.accountcontrol.repositories;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import loc.balsen.accountcontrol.data.Plan;
import loc.balsen.accountcontrol.data.Template;

public interface PlanRepository extends JpaRepository<Plan, Integer> {

  @Query(value = "select max(plan_date) from Plan", nativeQuery = true)
  LocalDate findMaxPlanDate();

  @Query(
      value = "select p.* from Plan p" + " left outer join Assignment a on a.plan=p.id"
          + " where a.id is null" + "   and p.deactivate_date is null" + "   and p.template = ?1",
      nativeQuery = true)
  List<Plan> findActiveByTemplateNotAssigned(Integer template);

  @Query(value = "select p from Assignment a right outer join a.plan p where a.id is null"
      + " and p.deactivateDate is NULL"
      + " and (p.endDate between ?1 and ?2 or p.startDate between ?1 and ?2 or (p.startDate <= ?1 and  p.endDate >= ?2 ) or matchStyle=3 )")
  List<Plan> findByPeriodNotAssigned(LocalDate mindate, LocalDate maxdate);

  @Query(
      value = "select * from Plan where plan_date between ?1 and ?2 and deactivate_date is null order by plan_date",
      nativeQuery = true)
  List<Plan> findByPlanDate(LocalDate mindate, LocalDate maxdate);

  @Query(value = "select p.* from Plan p " + " left join Assignment a on a.plan=p.id"
      + " where a.id is null" + " and p.plan_date between ?1 and ?2"
      + " and p.deactivate_date is null", nativeQuery = true)
  List<Plan> findByPlanDateNotAssigned(LocalDate mindate, LocalDate maxdate);

  List<Plan> findByTemplate(Template template);

  @Query(
      value = "select p.* from Plan p" + " inner join Sub_Category s on p.subcategory = s.id"
          + " where p.match_style = 3" + " and s.category = ?1" + " and deactivate_date is null",
      nativeQuery = true)
  Collection<Plan> findByPatternPlansAndCategory(Integer category);

  @Query(value = "select max(p.plan_date) from Plan p where p.template = ?1", nativeQuery = true)
  LocalDate findMaxPlanDateByTemplate(Integer templateid);

  @Query(value = "select min(p.plan_date) from Plan p where p.template = ?1", nativeQuery = true)
  LocalDate findMinPlanDateByTemplate(Integer templateid);

  @Query(value = "select max(p.plan_date) from Plan p" + " inner join Assignment a on a.plan=p.id"
      + " where p.template = ?1", nativeQuery = true)
  LocalDate findMaxAssignedPlanDateByTemplate(int id);
}
