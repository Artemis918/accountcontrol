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
		record.setEingang(LocalDate.now());
		record.setCreation(LocalDate.parse(fields[0],dateformater));
		record.setWertstellung(LocalDate.parse(fields[1],dateformater));

		AccountRecord.Type type = recordType.get(fields[2].trim());
		if (type == null) {
			throw new ParseException("Unknown belegart " + fields[2], 0);
		}
		record.setType(type);

		parseDetails(fields[3], record);

		record.setAbsender(fields[4]);
		record.setEmpfaenger(fields[5]);
		
		char euroLatin9 = 0xA4;

		// Value interpretieren
		String value = fields[6];
		value = value.replaceAll("\\.", "");
		value = value.replaceAll(",", "");
		value = value.replaceAll(" €", "");
		value = value.replaceAll(euroLatin9 + " ", "");
		record.setWert(Integer.parseInt(value));

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
			String referenz = fields[i++];
			while (i<fields.length && !fields[i].equals("Mandat") && !fields[i].equals("Verwendungszweck")) {
				referenz += " "+ fields[i++];
			}
			bubel.setReferenz(referenz);
			
			if (checkField(fields, i, "Mandat")) {
				i++;
				String mandat;
				mandat = fields[i++];
				while (i<fields.length && !fields[i].equals("Einreicher-ID")) {
					mandat += " " + fields[i++];
				}
				bubel.setMandat(mandat);
			}
			
			if (checkField(fields, i,"Einreicher-ID")) {
				i++;
				bubel.setEinreicherId(fields[i++]);
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
		aMap.put("Gutschrift", AccountRecord.Type.GUTSCHRIFT);
		aMap.put("Einzahlung", AccountRecord.Type.GUTSCHRIFT);
		aMap.put("Dauer Gutschrift", AccountRecord.Type.GUTSCHRIFT);
		aMap.put("Dauergutschrift", AccountRecord.Type.GUTSCHRIFT);
		aMap.put("Gehalt/Rente", AccountRecord.Type.GUTSCHRIFT);
		aMap.put("Lastschrift", AccountRecord.Type.LASTSCHRIFT);
		aMap.put("Auslandsauftrag", AccountRecord.Type.LASTSCHRIFT);
		aMap.put("Kreditkartenumsatz", AccountRecord.Type.LASTSCHRIFT);
		aMap.put("Dauer Lastschrift", AccountRecord.Type.LASTSCHRIFT);
		aMap.put("Überweisung", AccountRecord.Type.UEBERWEISUNG);
		aMap.put("Überweisung giropay", AccountRecord.Type.LASTSCHRIFT);
		aMap.put("Kartenverfügung", AccountRecord.Type.KARTE);
		aMap.put("Auszahlung", AccountRecord.Type.KARTE);
		aMap.put("Zinsen/Entgelt", AccountRecord.Type.ENTGELT);
		aMap.put("Entgelt", AccountRecord.Type.ENTGELT);
		aMap.put("Scheckeinreichung", AccountRecord.Type.GUTSCHRIFT);
		aMap.put("Gutschr.SEPA", AccountRecord.Type.GUTSCHRIFT);
		aMap.put("SEPA Überw.", AccountRecord.Type.UEBERWEISUNG);
		aMap.put("SDD Lastschr", AccountRecord.Type.LASTSCHRIFT);
		aMap.put("Storno", AccountRecord.Type.GUTSCHRIFT);
		aMap.put("Dauerauftrag", AccountRecord.Type.UEBERWEISUNG);
		aMap.put("Kartenzahlung", AccountRecord.Type.KARTE);
		aMap.put("Auszahlung Geldautomat", AccountRecord.Type.KARTE);
		recordType = Collections.unmodifiableMap(aMap);

	}

}
