package loc.balsen.kontospring.data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;

import lombok.Data;

@Data
@Entity
public class Zuordnung {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_zuordnung_name")
	@SequenceGenerator(name = "seq_zuordnung_name", sequenceName = "seq_zuordnung", allocationSize = 1)
	private int id;

	private int wert;
	private String shortdescription;
	private String description;
	private boolean committed;
	
	@OneToOne
	@JoinColumn(name = "plan")
	private Plan plan;
	
	@OneToOne
	@JoinColumn(name = "buchungsbeleg")
	private BuchungsBeleg buchungsbeleg;
	
	@ManyToOne
	@JoinColumn(name = "konto")	
	private Konto konto;

	public Double getEuroWert() {
		double res = getWert();
		res /= 100;
		return res;
	}

	public void setEuroWert(Double val) {
		val *= 100;
		setWert(val.intValue());
	}
}
