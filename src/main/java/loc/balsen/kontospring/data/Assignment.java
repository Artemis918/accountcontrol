package loc.balsen.kontospring.data;

import java.time.LocalDate;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import lombok.Data;

@Data
@Entity
@Table(name="zuordnung")
public class Assignment {

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
	private AccountRecord accountrecord;
	
	@ManyToOne
	@JoinColumn(name = "konto")	
	private SubCategory subcategory;

	public Double getEuroWert() {
		double res = getWert();
		res /= 100;
		return res;
	}

	public void setEuroWert(Double val) {
		val *= 100;
		setWert(val.intValue());
	}
	
	public LocalDate getStatsDay()  {
		return plan == null ? accountrecord.getWertstellung() : plan.getPlanDate();
		
	}
}