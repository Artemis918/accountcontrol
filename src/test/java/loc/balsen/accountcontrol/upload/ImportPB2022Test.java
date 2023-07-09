package loc.balsen.accountcontrol.upload;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import loc.balsen.accountcontrol.data.AccountRecord;
import loc.balsen.accountcontrol.repositories.AccountRecordRepository;

public class ImportPB2022Test {

  static String HEADER = "\n\n\n\n; \n\n\n\n";

  static String TESTDATA = "11.12.2022;12.12.2022;SEPA Lastschrift;Telecomica;"
      + "\"some more details \";IBNA;BIC;xxxxxxxxxxxx;yyyyyyyyyyyy yyyyy;"
      + "zzzzzzzzzzzzzzzz;;-42,80;";

  @Mock
  public AccountRecordRepository accountRecordRepository;

  @InjectMocks
  private ImportPBcsv2022 importer = new ImportPBcsv2022();

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
  public void testImport() throws ParseException, IOException {

    LocalDate start = LocalDate.now();

    BufferedInputStream input = createInputStream(HEADER + TESTDATA);
    importer.ImportFile("test.csv", input);

    ArgumentCaptor<AccountRecord> argcap = ArgumentCaptor.forClass(AccountRecord.class);
    verify(accountRecordRepository).save(argcap.capture());
    AccountRecord record = argcap.getValue();

    LocalDate received = record.getReceived();
    assertTrue(!received.isBefore(start) && !received.isAfter(LocalDate.now()));
    assertEquals(LocalDate.parse("2022-12-11"), record.getCreated());
    assertEquals(LocalDate.parse("2022-12-12"), record.getExecuted());
    assertEquals(AccountRecord.Type.DEBIT, record.getType());
    assertEquals("", record.getSender());
    assertEquals("Telecomica", record.getReceiver());
    assertEquals(-4280, record.getValue());
    assertEquals("some more details ", record.getDetails());
    assertEquals("xxxxxxxxxxxx", record.getReference());
    assertEquals("yyyyyyyyyyyy yyyyy", record.getMandate());
    assertEquals("zzzzzzzzzzzzzzzz", record.getSubmitter());
  }

  @Test
  public void testParseError() throws IOException, ParseException {
    BufferedInputStream input =
        createInputStream((HEADER + TESTDATA).substring(0, TESTDATA.length()));
    try {
      importer.ImportFile("test.csv", input);
    } catch (RuntimeException e) {
      return;
    }
    fail("no parse exception");
  }

  @Test
  public void testInsertTwice() throws ParseException, IOException {

    List<AccountRecord> recordList = new ArrayList<>();
    recordList
        .add(new AccountRecord(0, null, null, null, null, null, null, 0, null, null, null, null));
    when(accountRecordRepository.findByValueAndCreatedAndSenderAndReceiver(eq(-4280),
        any(LocalDate.class), any(String.class), any(String.class))).thenReturn(recordList);

    String testData2 = new String(TESTDATA).replace("-42,80", "-42,90");
    BufferedInputStream input =
        createInputStream(HEADER + testData2 + "\n" + TESTDATA + "\n" + testData2);
    importer.ImportFile("test.csv", input);

    ArgumentCaptor<AccountRecord> argcap = ArgumentCaptor.forClass(AccountRecord.class);
    verify(accountRecordRepository, times(2)).save(argcap.capture());
    List<AccountRecord> res = argcap.getAllValues();

    assertEquals(-4290, res.get(0).getValue());
    assertEquals(-4290, res.get(1).getValue());
  }

  private BufferedInputStream createInputStream(String data) throws UnsupportedEncodingException {
    return new BufferedInputStream(new ByteArrayInputStream(data.getBytes("UTF-8")));
  }
}
