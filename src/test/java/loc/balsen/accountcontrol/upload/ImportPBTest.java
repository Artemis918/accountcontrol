package loc.balsen.kontospring.upload;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.ByteArrayInputStream;
import java.io.IOException;
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

import loc.balsen.kontospring.data.AccountRecord;
import loc.balsen.kontospring.repositories.AccountRecordRepository;

public class ImportPBTest {

	static String HEADER = "\n\n";

	static String TESTDATA = "\"30.08.2018\";\"31.08.2018\";\"" + "Lastschrift\";" + "\"Referenz xxxxxxxxxxxx "
			+ "Mandat yyyyyyyyyyyy yyyyy " + "Einreicher-ID zzzzzzzzzzzzzzzz "
			+ "Verwendungszweck some more details \";" + "\"me and you\";" + "\"Telecomica\";" + "\"-42,80 €\";"
			+ "\"456,00 €\"";

	@Mock
	public AccountRecordRepository accountRecordRepository;

	@InjectMocks
	private ImportPB importer = new ImportPB(".csv", "UTF-8", ';', 2);

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

		ByteArrayInputStream input = new ByteArrayInputStream((HEADER + TESTDATA).getBytes("UTF-8"));
		importer.ImportFile("test.csv", input);

		ArgumentCaptor<AccountRecord> argcap = ArgumentCaptor.forClass(AccountRecord.class);
		verify(accountRecordRepository).save(argcap.capture());
		AccountRecord record = argcap.getValue();

		LocalDate received = record.getReceived();
		assertTrue(!received.isBefore(start) && !received.isAfter(LocalDate.now()));
		assertEquals(LocalDate.parse("2018-08-30"), record.getCreated());
		assertEquals(LocalDate.parse("2018-08-31"), record.getExecuted());
		assertEquals(AccountRecord.Type.DEBIT, record.getType());
		assertEquals("me and you", record.getSender());
		assertEquals("Telecomica", record.getReceiver());
		assertEquals(-4280, record.getValue());
		assertEquals("some more details", record.getDetails());
		assertEquals("xxxxxxxxxxxx", record.getReference());
		assertEquals("yyyyyyyyyyyy yyyyy", record.getMandate());
		assertEquals("zzzzzzzzzzzzzzzz", record.getSubmitter());
	}

	@Test
	public void testParseError() throws IOException, ParseException {
		ByteArrayInputStream input = new ByteArrayInputStream((HEADER + TESTDATA).substring(0, 148).getBytes("UTF-8"));
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
		recordList.add(new AccountRecord(0, null, null, null, null, null, null, 0, null, null, null, null));
		when(accountRecordRepository.findByValueAndCreatedAndSenderAndReceiver(eq(-4280), any(LocalDate.class),
				any(String.class), any(String.class))).thenReturn(recordList);

		String testData2 = new String(TESTDATA).replace("-42,80", "-42,90");
		ByteArrayInputStream input = new ByteArrayInputStream(
				(HEADER + testData2 + "\n" + TESTDATA + "\n" + testData2).getBytes("UTF-8"));
		importer.ImportFile("test.csv", input);

		ArgumentCaptor<AccountRecord> argcap = ArgumentCaptor.forClass(AccountRecord.class);
		verify(accountRecordRepository, times(2)).save(argcap.capture());
		List<AccountRecord> res = argcap.getAllValues();

		assertEquals(-4290, res.get(0).getValue());
		assertEquals(-4290, res.get(1).getValue());
	}

}
