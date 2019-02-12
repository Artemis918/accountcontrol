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
	
	Zuordnung findByPlan(Plan plan);

	List<Zuordnung> findByShortdescription(String string);

	@Query(value = "select * from Zuordnung z " 
			       + "inner join buchungsbeleg b on z.buchungsbeleg = b.id "
			       + "where b.wertstellung between ?1 and ?2 " 
		           + "and z.konto = ?3", nativeQuery=true)
	List<Zuordnung> findByKontoAndMonth(LocalDate start, LocalDate end, int id);

	@Modifying
	@Transactional
	@Query( value="delete from Zuordnung z where z.buchungsbeleg = ?1", nativeQuery=true)
	void deleteByBelegId(Integer id);
}
