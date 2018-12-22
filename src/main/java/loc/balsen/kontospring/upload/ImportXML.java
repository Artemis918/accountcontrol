package loc.balsen.kontospring.upload;

import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.input.DOMBuilder;
import org.springframework.format.datetime.joda.LocalDateTimeParser;
import org.springframework.stereotype.Component;
import org.xml.sax.SAXException;

import loc.balsen.kontospring.data.BuchungsBeleg;
import loc.balsen.kontospring.data.BuchungsBeleg.Art;
import loc.balsen.kontospring.upload.Importbase;

@Component
public class ImportXML extends Importbase {

	static DateTimeFormatter dateformater = DateTimeFormatter.ofPattern("yyyy-MM-dd");

	static private final HashMap<String, Art> belegArtenMap = new HashMap<String, Art>() {
		private static final long serialVersionUID = 1L;
		{
			put("NTRF+166", Art.GUTSCHRIFT);
			put("NDDT+105", Art.LASTSCHRIFT);
			put("NCMI+116", Art.UEBERWEISUNG);
			put("NTRF+153", Art.ENTGELT);
			put("NDDT+106", Art.KARTE);
			put("NDDT+083", Art.AUSZAHLUNG);
			put("NCMI+117", Art.DAUERAUFTRAG);
			put("NDDT+107", Art.LASTSCHRIFTKARTE);
		}
	};

	@Override
	boolean ImportFile(String filename, InputStream data) throws ParseException, IOException {
		if (!filename.endsWith(".xml")) {
			return false;
		}

		Document document = null;
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		DocumentBuilder documentBuilder;
		try {
			documentBuilder = factory.newDocumentBuilder();
			org.w3c.dom.Document w3cDocument = documentBuilder.parse(data);
			document = new DOMBuilder().build(w3cDocument);
		} catch (ParserConfigurationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SAXException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		List<Element> entryList = document.getRootElement().getChild("BkToCstmrAcctRpt").getChild("Rpt")
				.getChildren("Ntry");

		int entryNum = 0;
		for (Element entry : entryList) {
			entryNum++;
			try {
				save(createBeleg(entry));
			} catch (ParseException e) {
				throw new ParseException(e.getMessage() + ": Entry " + entryNum, 0);
			}
		}

		return true;
	}

	private BuchungsBeleg createBeleg(Element entry) throws ParseException {
		BuchungsBeleg beleg = new BuchungsBeleg();

		int amount = (int) (Double.parseDouble(getChild(entry, "Amt").getValue()) * 100);

		String cdtDbtInd = getChild(entry, "CdtDbtInd").getValue();

		if (cdtDbtInd.equals("DBIT"))
			amount *= -1;
		else if (!cdtDbtInd.equals("CRDT"))
			throw new ParseException("Unknown Indicator :" + cdtDbtInd, 0);
		
		beleg.setWert(amount);
		beleg.setBeleg(LocalDate.parse(getChild(entry, "BookgDt").getChildText("Dt"),dateformater));
		beleg.setWertstellung(LocalDate.parse(getChild(entry, "ValDt").getChildText("Dt"),dateformater));

		Element details = getChild(entry, "NtryDtls").getChild("TxDtls");

		Element parties = getChild(details, "RltdPties");
		beleg.setAbsender(getChild(parties, "Dbtr").getChildText("Nm"));
		beleg.setEmpfaenger(getChild(parties, "Cdtr").getChildText("Nm"));

		Element infoElement = getChild(details, "RmtInf");

		String infotxt = "";

		List<Element> infolines = infoElement.getChildren("Ustrd");
		for (Element line : infolines) {
			String text = line.getValue();
			if (text.startsWith("Referenz"))
				beleg.setReferenz(text.substring(9));
			else if (text.startsWith("Mandat"))
				beleg.setMandat(text.substring(7));
			else if (text.startsWith("Einreicher-ID"))
				beleg.setEinreicherId(text.substring(14));
			else
				infotxt += text;
		}
		beleg.setDetails(infotxt);

		beleg.setArt(getArt(details));
		beleg.setEingang(LocalDate.now());
		return beleg;
	}

	private Art getArt(Element details) throws ParseException {
		String arttext = getChild(details, "BkTxCd").getChild("Prtry").getChildText("Cd");
		Art art =  belegArtenMap.get(arttext);
		if (art == null)
			throw new ParseException("unknown Arttext: " + arttext, 0 );
		return art;
	}

	private Element getChild(Element entry, String childKey) throws ParseException {
		Element child = entry.getChild(childKey);
		if (child == null)
			throw new ParseException("key <" + childKey + "> not found", 0);
		return child;
	}
}
