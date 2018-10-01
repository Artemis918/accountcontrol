package loc.balsen.kontospring.repositories;


import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import loc.balsen.kontospring.data.Beleg;

public interface BelegRepository extends JpaRepository<Beleg, Long> {

	public List<Beleg> findByWertAndBelegAndAbsenderAndEmpfaenger(int wert, Date beleg, String absender, String empfaenger);
	
	@Query("select b from Beleg b left join Zuordnung z on (z.buchungsbeleg = b.id) where z.id is null order by b.wertstellung")
	public List<Beleg> findUnresolvedBeleg();
	
}
