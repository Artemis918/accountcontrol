package loc.balsen.kontospring.repositories;


import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import loc.balsen.kontospring.data.Beleg;

public interface BelegRepository extends JpaRepository<Beleg, Long> {

	public List<Beleg> findByWertAndBelegAndAbsenderAndEmpfaenger(int wert, Date beleg, String absender, String empfaenger);
}
