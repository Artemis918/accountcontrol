package loc.balsen.kontospring.dto;

import static org.junit.jupiter.api.Assertions.assertEquals;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;
import loc.balsen.kontospring.data.AccountRecord;

public class RecordDTOTest {

  @Test
  public void test() {
    List<String> details = new ArrayList<>();
    details.add("Reference NOTPROVIDED");

    AccountRecord record = new AccountRecord(0, null, null, LocalDate.now(), null, "sender",
        "receiver", 102056, details, null, null, null);

    RecordDTO dto = new RecordDTO(record);

    assertEquals("sender", dto.getPartner());
    assertEquals("Reference NOTPROVIDED", dto.getDetails());
  }

}
