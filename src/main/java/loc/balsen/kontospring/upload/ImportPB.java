package loc.balsen.kontospring.upload;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.text.ParseException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

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

		while (lines.hasNext()) {
			save(parseLine(lines.next()));
		}

		return true;
	}

	static DateTimeFormatter dateformater = DateTimeFormatter.ofPattern("dd.MM.yyyy");

	private AccountRecord parseLine(String fields[]) throws ParseException {

		AccountRecord record = new AccountRecord();
		record.setReceived(LocalDate.now());
		record.setCreated(LocalDate.parse(fields[0],dateformater));
		record.setExecuted(LocalDate.parse(fields[1],dateformater));

		AccountRecord.Type type = recordType.get(fields[2].trim());
		if (type == null) {
			throw new ParseException("Unknown record type " + fields[2], 0);
		}
		record.setType(type);

		parseDetails(fields[3], record);

		record.setSender(fields[4]);
		record.setReceiver(fields[5]);
		
		char euroLatin9 = 0xA4;

		// Value interpretieren
		String value = fields[6];
		value = value.replaceAll("\\.", "");
		value = value.replaceAll(",", "");
		value = value.replaceAll(" €", "");
		value = value.replaceAll(euroLatin9 + " ", "");
		record.setValue(Integer.parseInt(value));

		return record;
	}

	private void parseDetails(String detailsAll, AccountRecord bubel) {
		String details = new String();
		
		String fields[] = detailsAll.split(" ");
		int len = fields.length;		

		int i = parseReferences(bubel, fields);

		while (i<len) {
			if (details.length() > 0)
				details += " ";
			details+=fields[i++];
		}
		bubel.setDetails(details);
	}

	private int parseReferences(AccountRecord bubel, String[] fields) {
		int i = 0;
		if (fields[0].equals("Referenz")) {
			i++;
			String reference = fields[i++];
			while (i<fields.length && !fields[i].equals("Mandat") && !fields[i].equals("Verwendungszweck")) {
				reference += " "+ fields[i++];
			}
			bubel.setReference (reference);
			
			if (checkField(fields, i, "Mandat")) {
				i++;
				String mandate;
				mandate = fields[i++];
				while (i<fields.length && !fields[i].equals("Einreicher-ID")) {
					mandate += " " + fields[i++];
				}
				bubel.setMandate(mandate);
			}
			
			if (checkField(fields, i,"Einreicher-ID")) {
				i++;
				bubel.setSubmitter(fields[i++]);
			}
			
			if (checkField(fields, i,"Verwendungszweck")) {
				i++;
			}
		}
		return i;
	}

	private boolean checkField(String[] fields, int i,String label) {
		return i<fields.length && fields[i].equals(label);
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
