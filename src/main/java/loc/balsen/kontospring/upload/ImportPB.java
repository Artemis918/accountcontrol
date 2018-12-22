package loc.balsen.kontospring.upload;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReaderBuilder;

import loc.balsen.kontospring.data.BuchungsBeleg;

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

	private BuchungsBeleg parseLine(String fields[]) throws ParseException {

		BuchungsBeleg bubel = new BuchungsBeleg();
		bubel.setEingang(LocalDate.now());
		bubel.setBeleg(LocalDate.parse(fields[0],dateformater));
		bubel.setWertstellung(LocalDate.parse(fields[1],dateformater));

		BuchungsBeleg.Art art = belegArt.get(fields[2].trim());
		if (art == null) {
			throw new ParseException("Unknown belegart " + fields[2], 0);
		}
		bubel.setArt(art);

		parseDetails(fields[3], bubel);

		bubel.setAbsender(fields[4]);
		bubel.setEmpfaenger(fields[5]);
		
		char euroLatin9 = 0xA4;

		// Value interpretieren
		String value = fields[6];
		value = value.replaceAll("\\.", "");
		value = value.replaceAll(",", "");
		value = value.replaceAll(" €", "");
		value = value.replaceAll(euroLatin9 + " ", "");
		bubel.setWert(Integer.parseInt(value));

		return bubel;
	}

	private void parseDetails(String detailsAll, BuchungsBeleg bubel) {
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

	private int parseReferences(BuchungsBeleg bubel, String[] fields) {
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

	private static final Map<String, BuchungsBeleg.Art> belegArt;
	static {
		Map<String, BuchungsBeleg.Art> aMap = new HashMap<String, BuchungsBeleg.Art>(30);
		aMap.put("Gutschrift", BuchungsBeleg.Art.GUTSCHRIFT);
		aMap.put("Einzahlung", BuchungsBeleg.Art.GUTSCHRIFT);
		aMap.put("Dauer Gutschrift", BuchungsBeleg.Art.GUTSCHRIFT);
		aMap.put("Dauergutschrift", BuchungsBeleg.Art.GUTSCHRIFT);
		aMap.put("Gehalt/Rente", BuchungsBeleg.Art.GUTSCHRIFT);
		aMap.put("Lastschrift", BuchungsBeleg.Art.LASTSCHRIFT);
		aMap.put("Auslandsauftrag", BuchungsBeleg.Art.LASTSCHRIFT);
		aMap.put("Kreditkartenumsatz", BuchungsBeleg.Art.LASTSCHRIFT);
		aMap.put("Dauer Lastschrift", BuchungsBeleg.Art.LASTSCHRIFT);
		aMap.put("Überweisung", BuchungsBeleg.Art.UEBERWEISUNG);
		aMap.put("Überweisung giropay", BuchungsBeleg.Art.LASTSCHRIFT);
		aMap.put("Kartenverfügung", BuchungsBeleg.Art.KARTE);
		aMap.put("Auszahlung", BuchungsBeleg.Art.KARTE);
		aMap.put("Zinsen/Entgelt", BuchungsBeleg.Art.ENTGELT);
		aMap.put("Entgelt", BuchungsBeleg.Art.ENTGELT);
		aMap.put("Scheckeinreichung", BuchungsBeleg.Art.GUTSCHRIFT);
		aMap.put("Gutschr.SEPA", BuchungsBeleg.Art.GUTSCHRIFT);
		aMap.put("SEPA Überw.", BuchungsBeleg.Art.UEBERWEISUNG);
		aMap.put("SDD Lastschr", BuchungsBeleg.Art.LASTSCHRIFT);
		aMap.put("Storno", BuchungsBeleg.Art.GUTSCHRIFT);
		aMap.put("Dauerauftrag", BuchungsBeleg.Art.UEBERWEISUNG);
		aMap.put("Kartenzahlung", BuchungsBeleg.Art.KARTE);
		aMap.put("Auszahlung Geldautomat", BuchungsBeleg.Art.KARTE);
		belegArt = Collections.unmodifiableMap(aMap);

	}

}
