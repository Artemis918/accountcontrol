package loc.balsen.kontospring.repositories;


import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import loc.balsen.kontospring.data.BuchungsBeleg;
import loc.balsen.kontospring.data.BuchungsBeleg.Art;

public interface BuchungsBelegRepository extends JpaRepository<BuchungsBeleg, Integer> {

	public List<BuchungsBeleg> findByWertAndBelegAndAbsenderAndEmpfaenger(int wert, LocalDate beleg, String absender, String empfaenger);
	
	@Query(value = "select b.* from BuchungsBeleg b "
	               + "left join Zuordnung z on z.buchungsbeleg = b.id "
	               + "where z.id is null "
	               + "order by b.wertstellung"
	       , nativeQuery = true)
	public List<BuchungsBeleg> findUnresolvedBeleg();

	public Collection<BuchungsBeleg> findByArt(Art art);
	
}
