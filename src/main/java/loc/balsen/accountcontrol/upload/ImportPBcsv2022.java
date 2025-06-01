package loc.balsen.accountcontrol.upload;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.text.ParseException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import org.postgresql.util.PSQLException;
import org.springframework.stereotype.Component;
import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReaderBuilder;
import loc.balsen.accountcontrol.data.AccountRecord;

@Component
public class ImportPBcsv2022 extends Importbase {

  @Override
  boolean ImportFile(String filename, BufferedInputStream data) throws ParseException, IOException {
    if (!filename.endsWith(".csv")) {
      return false;
    }
    InputStreamReader filereader = new InputStreamReader(data);

    Iterator<String[]> lines = new CSVReaderBuilder(filereader).withSkipLines(8)
        .withCSVParser(new CSVParserBuilder().withSeparator(';').withQuoteChar('"').build()).build()
        .iterator();
    int linenum = 0;
    while (lines.hasNext()) {
      try {
        linenum++;
        save(parseLine(lines.next()));
      } catch (PSQLException e) {
        throw new ParseException(e.getMessage() + ": Entry " + linenum, 0);
      } catch (WrongParserException e) {
        return false;
      }
    }
    filereader.close();
    return true;
  }

  static DateTimeFormatter dateformater = DateTimeFormatter.ofPattern("d.M.yyyy");



  /* @formatter:off
   *  0 - Buchungstag
   *  1 - Wert
   *  2 - Umsatzart
   *  3 - Begünstigter / Auftraggeber
   *  4 - Verwendungszweck
   *  5 - +IBAN
   *  6 - +BIC
   *  7 - Kundenreferenz
   *  8 - Mandatsreferenz
   *  9 - Gläubiger ID
   * 10 - +Fremde Gebühren
   * 11 - Betrag
   * 12 - +Abweichender Empfänger
   * 13 - +Anzahl der Aufträge
   * 14 - +Anzahl der Schecks
   * 15 - +Soll
   * 16 - +Haben
   * 17 - +Währung
   * + = ingnored
   * @formatter:on
   */
  private AccountRecord parseLine(String fields[]) throws ParseException, WrongParserException {

    if (fields[0].equals("Kontostand")) {
      return null;
    }

    LocalDate created = LocalDate.parse(fields[0], dateformater);
    if (created.isBefore(LocalDate.of(2022, 11, 30))) {
      throw new WrongParserException();
    }

    LocalDate executed = LocalDate.parse(fields[1], dateformater);

    AccountRecord.Type type = recordType.get(fields[2].trim());
    if (type == null) {
      throw new ParseException("Unknown record type " + fields[2], 0);
    }

    // Value interpretieren
    String value = fields[11];

    value = value.replaceAll("\\.", ",");

    int comma = value.length() - value.lastIndexOf(",");
    if (comma > value.length()) {
      value += ",00";
    } else if (comma == 2) {
      value += "0";
    } else if (comma == 4) {
      value += "00";
    }

    value = value.replaceAll(",", "");

    int val = Integer.parseInt(value);

    String sender = val > 0 ? fields[3] : "";
    String details = fields[4];
    String reference = fields[7];
    String mandate = fields[8];
    String submitter = fields[9];
    String receiver = val < 0 ? fields[3] : "";



    List<String> detlist = new ArrayList<>();
    detlist.add(details);

    return new AccountRecord(0, LocalDate.now(), created, executed, type, sender, receiver, val,
        detlist, submitter, mandate, reference);
  }

  private static final Map<String, AccountRecord.Type> recordType;
  static {
    Map<String, AccountRecord.Type> aMap = new HashMap<String, AccountRecord.Type>(30);
    aMap.put("Überweisung", AccountRecord.Type.TRANSFER);
    aMap.put("SEPA Überweisung", AccountRecord.Type.TRANSFER);
    aMap.put("SEPA Überweisung (Lohn, Gehalt, Rente)", AccountRecord.Type.TRANSFER);
    aMap.put("SEPA Überweisung (Dauerauftrag)", AccountRecord.Type.TRANSFER);
    aMap.put("SEPA Überweisung (Übertrag)", AccountRecord.Type.TRANSFER);
    aMap.put("SEPA Überweisung Retoure", AccountRecord.Type.TRANSFER);
    aMap.put("Kartenzahlung", AccountRecord.Type.CARD);
    aMap.put("Bargeldauszahlung (Geldautomat)", AccountRecord.Type.CARD);
    aMap.put("Auszahlung", AccountRecord.Type.CARD);
    aMap.put("Bargeldauszahlung (Kasse)", AccountRecord.Type.CARD);
    aMap.put("SEPA Lastschrift", AccountRecord.Type.DEBIT);
    aMap.put("SEPA Lastschrift (ELV)", AccountRecord.Type.DEBIT);
    aMap.put("SEPA Echtzeitüberweisung", AccountRecord.Type.TRANSFER);
    aMap.put("Sonstige", AccountRecord.Type.DEBIT);
    aMap.put("Kontoabrechnung", AccountRecord.Type.DEBIT); //???
    recordType = Collections.unmodifiableMap(aMap);

  }
}
