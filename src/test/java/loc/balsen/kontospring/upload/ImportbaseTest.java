package loc.balsen.kontospring.upload;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.postgresql.util.PSQLException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.web.WebAppConfiguration;
import loc.balsen.kontospring.Application;
import loc.balsen.kontospring.data.AccountRecord;
import loc.balsen.kontospring.repositories.AccountRecordRepository;

@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
@ContextConfiguration(classes = Application.class)
@WebAppConfiguration
public class ImportbaseTest {

  @Autowired
  private AccountRecordRepository accountRecordRepository;

  @Autowired
  private ImportTest importer;

  @Test
  public void testSave() throws PSQLException {

    List<AccountRecord> result = null;

    LocalDate now = LocalDate.now();
    LocalDate later = now.plusDays(5);

    AccountRecord record1 = createRecord("ich", "du", now, 100);
    AccountRecord record2 = createRecord("ich", "du", now, 100);

    assertTrue(importer.save(record1));
    result = accountRecordRepository.findAll();
    assertEquals(1, result.size());
    assertNotNull(result.get(0).getId());
    assertNotNull(record1.getId());

    assertFalse(importer.save(null));
    assertFalse(importer.save(record2));
    assertEquals(1, result.size());

    assertTrue(importer.save(createRecord("ich", "du", now, 101)));
    assertTrue(importer.save(createRecord("ich", "du", later, 100)));
    assertTrue(importer.save(createRecord("er", "du", now, 100)));
    assertTrue(importer.save(createRecord("ich", "er", now, 100)));
    result = accountRecordRepository.findAll();
    assertEquals(5, result.size());

  }

  private AccountRecord createRecord(String sender, String receiver, LocalDate date, int value) {
    return new AccountRecord(0, null, date, null, null, sender, receiver, value, null, null, null,
        null);
  }

}
