package loc.balsen.accountcontrol.upload;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.text.ParseException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.ListIterator;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.input.DOMBuilder;
import org.postgresql.util.PSQLException;
import org.springframework.stereotype.Component;
import org.xml.sax.SAXException;
import loc.balsen.accountcontrol.data.AccountRecord;
import loc.balsen.accountcontrol.data.AccountRecord.Type;

@Component
public class ImportXML extends Importbase {

  static DateTimeFormatter dateformater = DateTimeFormatter.ofPattern("yyyy-MM-dd");

  static private final HashMap<String, Type> recordTypesMap = new HashMap<String, Type>() {
    private static final long serialVersionUID = 1L;
    {
      put("NTRF+166", Type.CREDIT);
      put("NDDT+105", Type.DEBIT);
      put("NCMI+116", Type.TRANSFER);
      put("NTRF+153", Type.REMUNERATION);
      put("NDDT+106", Type.CARD);
      put("NDDT+083", Type.PAYINGOUT);
      put("NCMI+117", Type.STANDINGORDER);
      put("NCMI+083", Type.REBOOKING);
      put("NDDT+107", Type.DEBITCARD);
      put("NCHG+805", Type.INTEREST);
      put("NCMI+082", Type.REBOOKING);
      put("NCMI+084", Type.PAYDIREKT);
    }
  };

  @Override
  boolean ImportFile(String filename, BufferedInputStream data) throws ParseException, IOException {
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
      throw new ParseException("Error in configuration while reading xml: " + e.getMessage(), 0);
    } catch (SAXException e) {
      throw new ParseException("Error in sax reader while reading xml: " + e.getMessage(), 0);
    }

    Element root = document.getRootElement();
    if (root == null)
      throw new ParseException("No document root in xml: " + filename, 0);

    Element acct = root.getChild("BkToCstmrAcctRpt", null);
    if (acct == null)
      throw new ParseException("No bookaccountreport in xml: " + filename, 0);

    Element rpt = acct.getChild("Rpt", null);
    if (rpt == null)
      throw new ParseException("No report in xml: " + filename, 0);

    List<Element> entryList = rpt.getChildren("Ntry", null);

    int entryNum = 0;
    for (Element entry : entryList) {
      entryNum++;
      try {
        save(createRecord(entry));
      } catch (ParseException e) {
        throw new ParseException(e.getMessage() + ": Entry " + entryNum, 0);
      } catch (PSQLException e) {
        throw new ParseException(e.getMessage() + ": Entry " + entryNum, 0);
      }
    }

    return true;
  }

  private AccountRecord createRecord(Element entry) throws ParseException {

    int amount = (int) (Double.parseDouble(getChild(entry, "Amt").getValue()) * 100);

    String cdtDbtInd = getChild(entry, "CdtDbtInd").getValue();

    if (cdtDbtInd.equals("DBIT"))
      amount *= -1;
    else if (!cdtDbtInd.equals("CRDT"))
      throw new ParseException("Unknown Indicator :" + cdtDbtInd, 0);

    LocalDate created =
        LocalDate.parse(getChild(entry, "BookgDt").getChildText("Dt", null), dateformater);
    LocalDate executed =
        LocalDate.parse(getChild(entry, "ValDt").getChildText("Dt", null), dateformater);

    Element details = getChild(entry, "NtryDtls").getChild("TxDtls", null);

    Element parties = getChild(details, "RltdPties");
    Element debitor = getChildOrNull(parties, "Dbtr");
    Element creditor = getChildOrNull(parties, "Cdtr");

    String reference = "";
    String mandate = "";
    String submitter = "";
    ArrayList<String> detailtexts = new ArrayList<>();

    Element infoElement = getChild(details, "RmtInf");

    List<Element> infolines = infoElement.getChildren("Ustrd", null);
    ListIterator<Element> lines = infolines.listIterator();

    while (lines.hasNext()) {
      String text = getLine(lines);
      if (text.startsWith("Referenz"))
        reference = text.substring(9);
      else if (text.startsWith("Mandat"))
        mandate = text.substring(7);
      else if (text.startsWith("Einreicher-ID"))
        submitter = text.substring(14);
      else {
        detailtexts.add(text);
      }
    }

    return new AccountRecord(0, LocalDate.now(), created, executed, getType(details),
        debitor == null ? "Bank" : debitor.getChildText("Nm", null),
        creditor == null ? "Bank" : creditor.getChildText("Nm", null), amount, detailtexts,
        submitter, mandate, reference);
  }

  private static String getLine(ListIterator<Element> iter) {
    String res = "";
    while (iter.hasNext()) {
      String part = iter.next().getValue();

      if (res.length() == 35 && (part.startsWith("Referenz") || part.startsWith("Mandat")
          || part.startsWith("Einreicher-ID"))) {
        iter.previous();
        break;
      }

      res += part;
      if (part.length() < 35) {
        break;
      }
    }
    return res;
  }

  private Type getType(Element details) throws ParseException {
    String typetext = getChild(details, "BkTxCd").getChild("Prtry", null).getChildText("Cd", null);
    Type type = recordTypesMap.get(typetext);
    if (type == null)
      throw new ParseException("unknown typetext: " + typetext, 0);
    return type;
  }

  private Element getChild(Element entry, String childKey) throws ParseException {
    Element child = entry.getChild(childKey, null);
    if (child == null)
      throw new ParseException("key <" + childKey + "> not found", 0);
    return child;
  }

  private Element getChildOrNull(Element entry, String childKey) {
    Element child = entry.getChild(childKey, null);
    return child;
  }
}
