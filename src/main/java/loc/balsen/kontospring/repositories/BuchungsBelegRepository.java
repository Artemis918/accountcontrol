package loc.balsen.kontospring.repositories;


import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import loc.balsen.kontospring.data.BuchungsBeleg;

public interface BuchungsBelegRepository extends JpaRepository<BuchungsBeleg, Integer> {

	public List<BuchungsBeleg> findByWertAndBelegAndAbsenderAndEmpfaenger(int wert, LocalDate beleg, String absender, String empfaenger);
	
	@Query(value = "select b.* from BuchungsBeleg b "
	               + "left join Zuordnung z on z.buchungsbeleg = b.id "
	               + "where z.id is null "
	               + "order by b.wertstellung"
	       , nativeQuery = true)
	public List<BuchungsBeleg> findUnresolvedBeleg();

	@Query(value = "select b.* from BuchungsBeleg b "
            + "where b.wertstellung between ?1 and ?2 "
			+"and b.art = ?3"
    , nativeQuery = true)
	public List<BuchungsBeleg> findByArtAndPeriod(LocalDate start, LocalDate end, Integer artId);
	
}
