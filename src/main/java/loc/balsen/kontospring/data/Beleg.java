package loc.balsen.kontospring.data;

import java.util.Date;

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
public class Beleg {

	public enum Art {
		GUTSCHRIFT ,
		LASTSCHRIFT ,
		UEBERWEISUNG ,
		KARTE,
		ENTGELT,
		MANUELL
	}
	
	public static int LEN_DETAIL = 512;
	public static int LEN_ABSENDER = 80;
	public static int LEN_EMPFAENGER = 80;
	public static int LEN_DETAILS = 50;
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_buchungsbeleg_name")
	@SequenceGenerator(name = "seq_buchungsbeleg_name", sequenceName = "seq_buchungsbeleg", allocationSize = 1)
	private int id;
	
	private Date eingang;
	private Date beleg;
	private Date wertstellung;
	private Art art;
	private String absender;
	private String empfaenger;
	private int wert;
	private String details;
	private String einreicherID;
	private String mandat;
	private String Referenz;
	
}
