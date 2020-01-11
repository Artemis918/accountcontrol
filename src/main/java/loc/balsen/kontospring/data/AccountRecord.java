package loc.balsen.kontospring.data;

import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import lombok.Data;

@Data
@Entity
@Table(name="buchungsbeleg")
public class AccountRecord {

	public static String LF= " | ";
	
	public enum Type {
		GUTSCHRIFT ,
		LASTSCHRIFT ,
		LASTSCHRIFTKARTE ,
		UEBERWEISUNG ,
		KARTE,
		ENTGELT,
		AUSZAHLUNG,
		DAUERAUFTRAG,
		MANUELL,
		UMBUCHUNG,
		ZINSEN
	}
	
	public static int LEN_DETAIL = 512;
	public static int LEN_ABSENDER = 80;
	public static int LEN_EMPFAENGER = 80;
	public static int LEN_DETAILS = 50;
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_buchungsbeleg_name")
	@SequenceGenerator(name = "seq_buchungsbeleg_name", sequenceName = "seq_buchungsbeleg", allocationSize = 1)
	private int id;
	
	private LocalDate eingang;
	
	@Column(name = "beleg")
	private LocalDate creation;
	
	private LocalDate wertstellung;
	
	@Column(name = "art")	
	private Type type;
	private String absender;
	private String empfaenger;
	private int wert;
	private String details;
	private String einreicherId;
	private String mandat;
	private String referenz;
	
	public String getDetailsNOLF() {
		if (details != null) 
			return details.replace(LF, "");
		else
			return "";
	}
	
	public void addDetailLine (String line) {
		if (details == null) 
			details = "";
		
		if (!details.isEmpty())
			details+=LF;
		
		details+=line;
	}

	public String getPartner() {
		return wert > 0 ? absender : empfaenger;
	}
}
