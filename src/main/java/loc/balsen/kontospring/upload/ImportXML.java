package loc.balsen.kontospring.upload;

import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.input.DOMBuilder;
import org.springframework.stereotype.Component;
import org.xml.sax.SAXException;

import loc.balsen.kontospring.data.AccountRecord;
import loc.balsen.kontospring.data.AccountRecord.Type;

@Component
public class ImportXML extends Importbase {

	static DateTimeFormatter dateformater = DateTimeFormatter.ofPattern("yyyy-MM-dd");

	static private final HashMap<String, Type> recordTypesMap = new HashMap<String, Type>() {
		private static final long serialVersionUID = 1L;
		{
			put("NTRF+166", Type.GUTSCHRIFT);
			put("NDDT+105", Type.LASTSCHRIFT);
			put("NCMI+116", Type.UEBERWEISUNG);
			put("NTRF+153", Type.ENTGELT);
			put("NDDT+106", Type.KARTE);
			put("NDDT+083", Type.AUSZAHLUNG);
			put("NCMI+117", Type.DAUERAUFTRAG);
			put("NCMI+083", Type.UMBUCHUNG);
			put("NDDT+107", Type.LASTSCHRIFTKARTE);
			put("NCHG+805", Type.ZINSEN);
			put("NCMI+082", Type.UMBUCHUNG);
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
			throw new ParseException("Error in configuration while reading xml: " + e.getMessage(), 0 );
		} catch (SAXException e) {
			throw new ParseException("Error in sax reader while reading xml: " + e.getMessage(), 0 );
		}
		
		Element root = document.getRootElement();
		Element acct = root.getChild("BkToCstmrAcctRpt",null);
		Element rpt = acct.getChild("Rpt",null);
		List<Element> entryList = rpt.getChildren("Ntry",null);

		int entryNum = 0;
		for (Element entry : entryList) {
			entryNum++;
			try {
				save(createRecord(entry));
			} catch (ParseException e) {
				throw new ParseException(e.getMessage() + ": Entry " + entryNum, 0);
			}
		}

		return true;
	}

	private AccountRecord createRecord(Element entry) throws ParseException {
		AccountRecord record = new AccountRecord();

		int amount = (int) (Double.parseDouble(getChild(entry, "Amt").getValue()) * 100);

		String cdtDbtInd = getChild(entry, "CdtDbtInd").getValue();

		if (cdtDbtInd.equals("DBIT"))
			amount *= -1;
		else if (!cdtDbtInd.equals("CRDT"))
			throw new ParseException("Unknown Indicator :" + cdtDbtInd, 0);
		
		record.setWert(amount);
		record.setCreation(LocalDate.parse(getChild(entry, "BookgDt").getChildText("Dt",null),dateformater));
		record.setWertstellung(LocalDate.parse(getChild(entry, "ValDt").getChildText("Dt",null),dateformater));

		Element details = getChild(entry, "NtryDtls").getChild("TxDtls",null);

		Element parties = getChild(details, "RltdPties");
		record.setAbsender(getChild(parties, "Dbtr").getChildText("Nm",null));
		record.setEmpfaenger(getChild(parties, "Cdtr").getChildText("Nm",null));

		Element infoElement = getChild(details, "RmtInf");


		List<Element> infolines = infoElement.getChildren("Ustrd",null);
		for (Element line : infolines) {
			String text = line.getValue();
			if (text.startsWith("Referenz"))
				record.setReferenz(text.substring(9));
			else if (text.startsWith("Mandat"))
				record.setMandat(text.substring(7));
			else if (text.startsWith("Einreicher-ID"))
				record.setEinreicherId(text.substring(14));
			else {
				record.addDetailLine(text);
			}
		}

		record.setType(getType(details));
		record.setEingang(LocalDate.now());
		return record;
	}

	private Type getType(Element details) throws ParseException {
		String typetext = getChild(details, "BkTxCd").getChild("Prtry",null).getChildText("Cd",null);
		Type type =  recordTypesMap.get(typetext);
		if (type == null)
			throw new ParseException("unknown Arttext: " + typetext, 0 );
		return type;
	}

	private Element getChild(Element entry, String childKey) throws ParseException {
		Element child = entry.getChild(childKey,null);
		if (child == null)
			throw new ParseException("key <" + childKey + "> not found", 0);
		return child;
	}
}
