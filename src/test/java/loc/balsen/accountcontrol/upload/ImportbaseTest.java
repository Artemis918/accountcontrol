package loc.balsen.accountcontrol.upload;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.same;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.postgresql.util.PSQLException;
import loc.balsen.accountcontrol.data.AccountRecord;
import loc.balsen.accountcontrol.repositories.AccountRecordRepository;

public class ImportbaseTest {

  @Mock
  public AccountRecordRepository accountRecordRepository;

  @InjectMocks
  private ImportTest importer = new ImportTest();

  private AutoCloseable closeable;

  @BeforeEach
  public void setup() {
    closeable = MockitoAnnotations.openMocks(this);
  }

  @AfterEach
  public void teardown() throws Exception {
    closeable.close();
  }

  @Test
  public void testSave() throws PSQLException {

    List<AccountRecord> result = null;

    LocalDate now = LocalDate.now();

    AccountRecord record1 = createRecord("ich", "du", now, 100);
    AccountRecord record2 = createRecord("ich", "ihr", now, 101);


    when(accountRecordRepository.findByValueAndCreatedAndSenderAndReceiver(eq(100), same(now),
        eq("ich"), eq("du"))).thenReturn(new ArrayList<AccountRecord>());

    List<AccountRecord> res = new ArrayList<>();
    res.add(record2);
    when(accountRecordRepository.findByValueAndCreatedAndSenderAndReceiver(eq(101), same(now),
        eq("ich"), eq("ihr"))).thenReturn(res);

    importer.save(record1);
    verify(accountRecordRepository, times(1)).save(any(AccountRecord.class));

    importer.save(record2);
    verify(accountRecordRepository, times(1)).save(any(AccountRecord.class));

  }

  private AccountRecord createRecord(String sender, String receiver, LocalDate date, int value) {
    return new AccountRecord(0, null, date, null, null, sender, receiver, value, null, null, null,
        null);
  }

}
