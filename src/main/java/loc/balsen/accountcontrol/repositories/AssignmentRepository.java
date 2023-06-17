package loc.balsen.accountcontrol.repositories;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import jakarta.transaction.Transactional;
import loc.balsen.accountcontrol.data.Assignment;
import loc.balsen.accountcontrol.data.Plan;

public interface AssignmentRepository extends JpaRepository<Assignment, Integer> {

  public Assignment findByPlan(Plan plan);

  public List<Assignment> findByShortDescription(String string);

  @Query(value = "select a from Assignment a inner join a.accountrecord ar "
      + "left outer join a.plan p "
      + "where (( p.id is null and ar.executed between ?1 and ?2 ) or p.planDate between ?1 and ?2 ) "
      + "and a.subCategory.id = ?3")
  public List<Assignment> findBySubCategoryAndMonth(LocalDate start, LocalDate end, int id);

  @Modifying
  @Transactional
  @Query(value = "delete from Assignment a where a.accountrecord = ?1", nativeQuery = true)
  public void deleteByRecordId(Integer id);

  @Query(value = "select a from Assignment a "
      + "inner join a.accountrecord ar where a.plan.id is null "
      + "  and ar.executed between ?1 and ?2 and a.committed = true order by ar.executed")
  public List<Assignment> findAllNotPlannedByPeriod(LocalDate start, LocalDate end);

  @Query(value = "select * from Assignment a "
      + "inner join account_record ar on a.accountrecord = ar.id "
      + "inner join plan p on a.plan = p.id " + "  and p.plan_date between ?1 and ?2 "
      + "  and a.committed = true " + "order by p.plan_date", nativeQuery = true)
  public List<Assignment> findAllPlannedByPeriod(LocalDate start, LocalDate end);

  public int countBySubCategoryId(int subCategory);

  public void deleteBySubCategoryId(int subCategory);

}
