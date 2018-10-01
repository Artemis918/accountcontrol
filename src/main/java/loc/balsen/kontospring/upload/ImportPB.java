package loc.balsen.kontospring.upload;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReaderBuilder;

import loc.balsen.kontospring.data.Beleg;

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

	static DateFormat dateformater = new SimpleDateFormat("dd.MM.yyyy");

	private Beleg parseLine(String fields[]) throws ParseException {

		Beleg bubel = new Beleg();
		bubel.setEingang(new Date());
		bubel.setBeleg(dateformater.parse(fields[0]));
		bubel.setWertstellung(dateformater.parse(fields[1]));

		Beleg.Art art = belegArt.get(fields[2].trim());
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

	private void parseDetails(String detailsAll, Beleg bubel) {
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

	private int parseReferences(Beleg bubel, String[] fields) {
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
				bubel.setEinreicherID(fields[i++]);
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

	private static final Map<String, Beleg.Art> belegArt;
	static {
		Map<String, Beleg.Art> aMap = new HashMap<String, Beleg.Art>(30);
		aMap.put("Gutschrift", Beleg.Art.GUTSCHRIFT);
		aMap.put("Einzahlung", Beleg.Art.GUTSCHRIFT);
		aMap.put("Dauer Gutschrift", Beleg.Art.GUTSCHRIFT);
		aMap.put("Dauergutschrift", Beleg.Art.GUTSCHRIFT);
		aMap.put("Gehalt/Rente", Beleg.Art.GUTSCHRIFT);
		aMap.put("Lastschrift", Beleg.Art.LASTSCHRIFT);
		aMap.put("Auslandsauftrag", Beleg.Art.LASTSCHRIFT);
		aMap.put("Kreditkartenumsatz", Beleg.Art.LASTSCHRIFT);
		aMap.put("Dauer Lastschrift", Beleg.Art.LASTSCHRIFT);
		aMap.put("Überweisung", Beleg.Art.UEBERWEISUNG);
		aMap.put("Überweisung giropay", Beleg.Art.LASTSCHRIFT);
		aMap.put("Kartenverfügung", Beleg.Art.KARTE);
		aMap.put("Auszahlung", Beleg.Art.KARTE);
		aMap.put("Zinsen/Entgelt", Beleg.Art.ENTGELT);
		aMap.put("Entgelt", Beleg.Art.ENTGELT);
		aMap.put("Scheckeinreichung", Beleg.Art.GUTSCHRIFT);
		aMap.put("Gutschr.SEPA", Beleg.Art.GUTSCHRIFT);
		aMap.put("SEPA Überw.", Beleg.Art.UEBERWEISUNG);
		aMap.put("SDD Lastschr", Beleg.Art.LASTSCHRIFT);
		aMap.put("Storno", Beleg.Art.GUTSCHRIFT);
		aMap.put("Dauerauftrag", Beleg.Art.UEBERWEISUNG);
		aMap.put("Kartenzahlung", Beleg.Art.KARTE);
		aMap.put("Auszahlung Geldautomat", Beleg.Art.KARTE);
		belegArt = Collections.unmodifiableMap(aMap);

	}

}
