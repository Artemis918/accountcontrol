package loc.balsen.accountcontrol.repositories;


import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import loc.balsen.accountcontrol.data.AccountRecord;

public interface AccountRecordRepository extends JpaRepository<AccountRecord, Integer> {

  public List<AccountRecord> findByValueAndCreatedAndSenderAndReceiver(int value, LocalDate created,
      String sender, String receiver);

  @Query(value = "select ar from Assignment a right outer join a.accountrecord ar"
      + " where a.id is null order by ar.executed")
  public List<AccountRecord> findUnresolvedRecords();

  @Query(value = "select ar from AccountRecord ar where ar.executed between ?1 and ?2 "
      + "and ar.type = ?3")
  public List<AccountRecord> findByTypeAndPeriod(LocalDate start, LocalDate end, Integer type);

}
