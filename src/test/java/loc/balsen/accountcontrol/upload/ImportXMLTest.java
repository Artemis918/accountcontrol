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
import java.io.File;
import java.io.FileInputStream;
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

public class ImportXMLTest {

  static String HEADER = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n"
      + "<Document xmlns=\"urn:iso:std:iso:20022:tech:xsd:camt.052.001.06\">\n"
      + "  <BkToCstmrAcctRpt>\n" + "    <Rpt>\n" + "      <Id>isome account</Id>\n"
      + "      <CreDtTm>2021-03-13T11:29:08.710+01:00</CreDtTm>\n" + "      <Acct>\n"
      + "        <Id>\n" + "          <IBAN>DE123456789123456</IBAN>\n" + "        </Id>\n"
      + "      </Acct>\n" + "      <Bal>\n" + "      </Bal>\n";

  static String TESTDATA = "      <Ntry>\n" + "        <Amt Ccy=\"EUR\">49.16</Amt>\n"
      + "        <CdtDbtInd>DBIT</CdtDbtInd>\n" + "        <Sts>BOOK</Sts>\n"
      + "        <BookgDt>\n" + "          <Dt>2021-02-26</Dt>\n" + "        </BookgDt>\n"
      + "        <ValDt>\n" + "          <Dt>2021-02-27</Dt>\n" + "        </ValDt>\n"
      + "        <BkTxCd>\n" + "          <Domn>\n" + "          </Domn>\n" + "          <Prtry>\n"
      + "          </Prtry>\n" + "        </BkTxCd>\n" + "        <NtryDtls>\n"
      + "          <TxDtls>\n" + "            <Amt Ccy=\"EUR\">49.16</Amt>\n"
      + "            <CdtDbtInd>DBIT</CdtDbtInd>\n" + "            <BkTxCd>\n"
      + "              <Domn>\n" + "                <Cd>PMNT</Cd>\n" + "                <Fmly>\n"
      + "                  <Cd>RDDT</Cd>\n" + "                  <SubFmlyCd>ESDD</SubFmlyCd>\n"
      + "                </Fmly>\n" + "              </Domn>\n" + "              <Prtry>\n"
      + "                <Cd>NDDT+105</Cd>\n" + "                <Issr>DK</Issr>\n"
      + "              </Prtry>\n" + "            </BkTxCd>\n" + "            <RltdPties>\n"
      + "              <Dbtr>\n" + "                <Nm>this is me</Nm>\n"
      + "              </Dbtr>\n" + "              <Cdtr>\n"
      + "                <Nm>this is the other one</Nm>\n" + "              </Cdtr>\n"
      + "            </RltdPties>\n" + "            <RmtInf>\n"
      + "              <Ustrd>Referenz 01234567890123456789012345</Ustrd>\n"
      + "              <Ustrd>still Referenz</Ustrd>\n"
      + "              <Ustrd>Mandat DE00000000000000000000000000</Ustrd>\n"
      + "              <Ustrd>Einreicher-ID DE88ZZZ000000000000</Ustrd>\n"
      + "              <Ustrd>some more silly details we want to </Ustrd>\n"
      + "              <Ustrd>match against</Ustrd>\n"
      + "              <Ustrd>RG billnumber </Ustrd>\n" + "            </RmtInf>\n"
      + "          </TxDtls>\n" + "        </NtryDtls>\n" + "      </Ntry>";

  static String FOOTER = "    </Rpt>\n" + "  </BkToCstmrAcctRpt>\n" + "</Document>\n";

  static String testfile = "/tmp/import_account_test.xml";

  @Mock
  AccountRecordRepository accountRecordRepository;

  @InjectMocks
  ImportXML importer = new ImportXML();

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
  public void testFileImport() throws ParseException, IOException {
    File importFile = new File(testfile);
    if (importFile.exists() && !importFile.isDirectory()) {
      BufferedInputStream input = new BufferedInputStream(new FileInputStream(testfile));
      importer.ImportFile("test.xml", input);
    }
  }

  @Test
  public void testImport() throws ParseException, IOException {

    LocalDate start = LocalDate.now();

    BufferedInputStream input = createInputStream(HEADER + TESTDATA + FOOTER);
    importer.ImportFile("test.xml", input);

    ArgumentCaptor<AccountRecord> argcap = ArgumentCaptor.forClass(AccountRecord.class);
    verify(accountRecordRepository).save(argcap.capture());
    AccountRecord record = argcap.getValue();

    LocalDate received = record.getReceived();
    assertTrue(!received.isBefore(start) && !received.isAfter(LocalDate.now()));
    assertEquals(LocalDate.parse("2021-02-26"), record.getCreated());
    assertEquals(LocalDate.parse("2021-02-27"), record.getExecuted());
    assertEquals(AccountRecord.Type.DEBIT, record.getType());
    assertEquals("this is me", record.getSender());
    assertEquals("this is the other one", record.getReceiver());
    assertEquals(-4916, record.getValue());
    assertEquals("some more silly details we want to match against | RG billnumber ",
        record.getDetails());
    assertEquals("01234567890123456789012345still Referenz", record.getReference());
    assertEquals("DE00000000000000000000000000", record.getMandate());
    assertEquals("DE88ZZZ000000000000", record.getSubmitter());
  }

  @Test
  public void testParseError() throws IOException, ParseException {
    BufferedInputStream input = createInputStream((HEADER + TESTDATA).substring(0, 148));
    try {
      importer.ImportFile("test.xml", input);
    } catch (ParseException e) {
      return;
    }
    fail("no parse exception");
  }

  @Test
  public void testInsertTwice() throws ParseException, IOException {

    List<AccountRecord> recordList = new ArrayList<>();
    List<AccountRecord> emptyList = new ArrayList<>();
    recordList
        .add(new AccountRecord(0, null, null, null, null, null, null, 0, null, null, null, null));

    when(accountRecordRepository.findByValueAndCreatedAndSenderAndReceiver(eq(-4916),
        any(LocalDate.class), any(String.class), any(String.class))).thenReturn(recordList);
    when(accountRecordRepository.findByValueAndCreatedAndSenderAndReceiver(eq(-4920),
        any(LocalDate.class), any(String.class), any(String.class))).thenReturn(emptyList);

    String testData2 = new String(TESTDATA);
    testData2 = testData2.replace("49.16", "42.90");
    BufferedInputStream input = createInputStream(
        HEADER + "\n" + testData2 + "\n" + TESTDATA + "\n" + testData2 + "\n" + FOOTER);
    importer.ImportFile("test.xml", input);

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
