package loc.balsen.kontospring.upload;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.text.ParseException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.postgresql.util.PSQLException;

import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReaderBuilder;

import loc.balsen.kontospring.data.AccountRecord;

public class ImportPB extends Importbase {

	private String postfix;
	private char delimiter;
	private int headerlines;
	private String charset;

	ImportPB(String postfix, String charset, char delimiter, int headerlines) {
		super();
		this.postfix = postfix;
		this.delimiter = delimiter;
		this.headerlines = headerlines;
		this.charset = charset;
	}

	@Override
	boolean ImportFile(String filename, InputStream data) throws ParseException, IOException {
		if (!filename.endsWith(postfix)) {
			return false;
		}

		InputStreamReader filereader = new InputStreamReader(data, charset);

		Iterator<String[]> lines = new CSVReaderBuilder(filereader).withSkipLines(headerlines)
				.withCSVParser(new CSVParserBuilder().withSeparator(delimiter).withQuoteChar('"').build()).build()
				.iterator();
		int linenum = 0;
		while (lines.hasNext()) {
			try {
				linenum++;
				save(parseLine(lines.next()));
			} catch (PSQLException e) {
				throw new ParseException(e.getMessage() + ": Entry " + linenum, 0);
			}
		}

		return true;
	}

	static DateTimeFormatter dateformater = DateTimeFormatter.ofPattern("dd.MM.yyyy");

	private AccountRecord parseLine(String fields[]) throws ParseException {

		LocalDate created = LocalDate.parse(fields[0], dateformater);
		LocalDate executed = LocalDate.parse(fields[1], dateformater);

		AccountRecord.Type type = recordType.get(fields[2].trim());
		if (type == null) {
			throw new ParseException("Unknown record type " + fields[2], 0);
		}

		String details = "";
		String reference = "";
		String mandate = "";
		String submitter = "";
		String detailfields[] = fields[3].split(" ");
		int detlen = detailfields.length;

		int i = 0;
		if (detailfields[0].equals("Referenz")) {
			i++;
			reference = detailfields[i++];
			while (i < detlen && !detailfields[i].equals("Mandat") && !detailfields[i].equals("Verwendungszweck")) {
				reference += " " + detailfields[i++];
			}

			if (checkField(detailfields, i, "Mandat")) {
				i++;
				mandate = detailfields[i++];
				while (i < detlen && !detailfields[i].equals("Einreicher-ID")) {
					mandate += " " + detailfields[i++];
				}
			}

			if (checkField(detailfields, i, "Einreicher-ID")) {
				i++;
				submitter = detailfields[i++];
			}

			if (checkField(detailfields, i, "Verwendungszweck")) {
				i++;
			}
		}
		while (i < detlen) {
			if (details.length() > 0)
				details += " ";
			details += detailfields[i++];
		}
		ArrayList<String> detlist = new ArrayList<>();
		detlist.add(details);

		String sender = fields[4];
		String receiver = fields[5];

		char euroLatin9 = 0xA4;

		// Value interpretieren
		String value = fields[6];
		value = value.replaceAll("\\.", "");
		value = value.replaceAll(",", "");
		value = value.replaceAll(" €", "");
		value = value.replaceAll(euroLatin9 + " ", "");
		int val = Integer.parseInt(value);

		return new AccountRecord(0, LocalDate.now(), created, executed, type, sender, receiver, val, detlist, submitter,
				mandate, reference);
	}

	private boolean checkField(String[] fields, int i, String label) {
		return i < fields.length && fields[i].equals(label);
	}

	private static final Map<String, AccountRecord.Type> recordType;
	static {
		Map<String, AccountRecord.Type> aMap = new HashMap<String, AccountRecord.Type>(30);
		aMap.put("Gutschrift", AccountRecord.Type.CREDIT);
		aMap.put("Einzahlung", AccountRecord.Type.CREDIT);
		aMap.put("Dauer Gutschrift", AccountRecord.Type.CREDIT);
		aMap.put("Dauergutschrift", AccountRecord.Type.CREDIT);
		aMap.put("Gehalt/Rente", AccountRecord.Type.CREDIT);
		aMap.put("Lastschrift", AccountRecord.Type.DEBIT);
		aMap.put("Auslandsauftrag", AccountRecord.Type.DEBIT);
		aMap.put("Kreditkartenumsatz", AccountRecord.Type.DEBIT);
		aMap.put("Dauer Lastschrift", AccountRecord.Type.DEBIT);
		aMap.put("Überweisung", AccountRecord.Type.TRANSFER);
		aMap.put("Überweisung giropay", AccountRecord.Type.DEBIT);
		aMap.put("Kartenverfügung", AccountRecord.Type.CARD);
		aMap.put("Auszahlung", AccountRecord.Type.CARD);
		aMap.put("Zinsen/Entgelt", AccountRecord.Type.REMUNERATION);
		aMap.put("Entgelt", AccountRecord.Type.REMUNERATION);
		aMap.put("Scheckeinreichung", AccountRecord.Type.CREDIT);
		aMap.put("Gutschr.SEPA", AccountRecord.Type.CREDIT);
		aMap.put("SEPA Überw.", AccountRecord.Type.TRANSFER);
		aMap.put("SDD Lastschr", AccountRecord.Type.DEBIT);
		aMap.put("Storno", AccountRecord.Type.CREDIT);
		aMap.put("Dauerauftrag", AccountRecord.Type.TRANSFER);
		aMap.put("Kartenzahlung", AccountRecord.Type.CARD);
		aMap.put("Auszahlung Geldautomat", AccountRecord.Type.CARD);
		recordType = Collections.unmodifiableMap(aMap);

	}
}
