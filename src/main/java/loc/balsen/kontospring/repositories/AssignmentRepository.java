package loc.balsen.kontospring.repositories;

import java.time.LocalDate;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import loc.balsen.kontospring.data.Assignment;
import loc.balsen.kontospring.data.Plan;

public interface AssignmentRepository extends JpaRepository<Assignment, Integer> {
	
	public Assignment findByPlan(Plan plan);

	public List<Assignment> findByShortdescription(String string);

	@Query(value = "select * from Assignment a " 
			       + "inner join account_record ar on a.accountrecord = ar.id "
			       + "left outer join plan p on a.plan = p.id "
			       + "where (( p.id is null and ar.executed between ?1 and ?2 ) or p.plan_date between ?1 and ?2 ) " 
		           + "and a.subcategory = ?3", nativeQuery=true)
	public List<Assignment> findBySubCategoryAndMonth(LocalDate start, LocalDate end, int id);

	@Modifying
	@Transactional
	@Query( value="delete from Assignment a where a.accountrecord = ?1", nativeQuery=true)
	public void deleteByRecordId(Integer id);
	
	@Query(value = "select * from Assignment a "
		       + "inner join account_record ar on a.accountrecord= ar.id "
		       + "where a.plan is null "
		       + "  and ar.executed between ?1 and ?2 "
		       + "  and a.committed = true "
		       + "order by ar.executed" , nativeQuery=true)
	public List<Assignment> findAllNotPlannedByPeriod(LocalDate start, LocalDate end);

	@Query(value = "select * from Assignment a "
		       + "inner join account_record ar on a.accountrecord = ar.id "
		       + "inner join plan p on a.plan = p.id "
		       + "  and p.plan_date between ?1 and ?2 "
		       + "  and a.committed = true "
		       + "order by ar.plan_date" , nativeQuery=true)
	public List<Assignment> findAllPlannedByPeriod(LocalDate start, LocalDate end);
	
	public int countBySubCategoryId(int subCategory);

	public void deleteBySubCategoryId(int subCategory);

}