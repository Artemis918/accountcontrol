package loc.balsen.kontospring.repositories;

import java.time.LocalDate;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.Zuordnung;

public interface ZuordnungRepository extends JpaRepository<Zuordnung, Integer> {
	
	public Zuordnung findByPlan(Plan plan);

	public List<Zuordnung> findByShortdescription(String string);

	@Query(value = "select * from Zuordnung z " 
			       + "inner join buchungsbeleg b on z.buchungsbeleg = b.id "
			       + "left outer join plan p on z.plan = p.id "
			       + "where (( p.id is null and b.wertstellung between ?1 and ?2 ) or p.plan_date between ?1 and ?2 ) " 
		           + "and z.konto = ?3", nativeQuery=true)
	public List<Zuordnung> findByKontoAndMonth(LocalDate start, LocalDate end, int id);

	@Modifying
	@Transactional
	@Query( value="delete from Zuordnung z where z.buchungsbeleg = ?1", nativeQuery=true)
	public void deleteByBelegId(Integer id);
	
	@Query(value = "select * from Zuordnung z "
		       + "inner join buchungsbeleg b on z.buchungsbeleg = b.id "
		       + "where z.plan is null "
		       + "  and b.wertstellung between ?1 and ?2 "
		       + "  and z.committed = true "
		       + "order by b.wertstellung" , nativeQuery=true)
	public List<Zuordnung> findAllNotPlannedByPeriod(LocalDate start, LocalDate end);

	@Query(value = "select * from Zuordnung z "
		       + "inner join buchungsbeleg b on z.buchungsbeleg = b.id "
		       + "inner join plan p on z.plan = p.id "
		       + "  and p.plan_date between ?1 and ?2 "
		       + "  and z.committed = true "
		       + "order by p.plan_date" , nativeQuery=true)
	public List<Zuordnung> findAllPlannedByPeriod(LocalDate start, LocalDate end);

}
