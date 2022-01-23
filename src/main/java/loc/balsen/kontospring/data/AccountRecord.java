package loc.balsen.kontospring.data;

import java.time.LocalDate;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;

import lombok.Data;

@Data
@Entity
public class AccountRecord {

	public static String LF= " | ";
	
	public enum Type {
		CREDIT ,
		DEBIT ,
		DEBITCARD ,
		TRANSFER ,
		CARD,
		REMUNERATION,
		PAYINGOUT,
		STANDINGORDER,
		MANUEL,
		REBOOKING,
		INTEREST,
		PAYDIREKT
	}
	
	public static int LEN_DETAILS = 200;
	public static int LEN_SENDER = 80;
	public static int LEN_RECEIVER = 80;
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_accountrecord_name")
	@SequenceGenerator(name = "seq_accountrecord_name", sequenceName = "seq_accountrecord", allocationSize = 1)
	private int id;
	
	private LocalDate received;
	
	private LocalDate created;
	
	private LocalDate executed;
	
	private Type type;
	private String sender;
	private String receiver;
	private int value;
	private String details;
	private String submitter;
	private String mandate;
	private String reference;
	
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

	public String getOtherParty() {
		return value > 0 ? sender : receiver;
	}
}
