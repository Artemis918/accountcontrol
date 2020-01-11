package loc.balsen.kontospring.repositories;


import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import loc.balsen.kontospring.data.AccountRecord;

public interface AccountRecordRepository extends JpaRepository<AccountRecord, Integer> {

	public List<AccountRecord> findByWertAndCreationAndAbsenderAndEmpfaenger(int wert, LocalDate creation, String absender, String empfaenger);
	
	@Query(value = "select b.* from BuchungsBeleg b "
	               + "left join Zuordnung z on z.buchungsbeleg = b.id "
	               + "where z.id is null "
	               + "order by b.wertstellung"
	       , nativeQuery = true)
	public List<AccountRecord> findUnresolvedRecords();

	@Query(value = "select b.* from BuchungsBeleg b "
            + "where b.wertstellung between ?1 and ?2 "
			+"and b.art = ?3"
    , nativeQuery = true)
	public List<AccountRecord> findByArtAndPeriod(LocalDate start, LocalDate end, Integer artId);
	
}
