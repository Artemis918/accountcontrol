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

import lombok.Data;

@Data
@Entity
public class Assignment {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_assignment_name")
	@SequenceGenerator(name = "seq_assignment_name", sequenceName = "seq_assignment", allocationSize = 1)
	private int id;

	private int value;
	private String shortdescription;
	private String description;
	private boolean committed;
	
	@OneToOne
	@JoinColumn(name = "plan")
	private Plan plan;
	
	@OneToOne
	@JoinColumn(name = "accountrecord")
	private AccountRecord accountrecord;
	
	@ManyToOne
	@JoinColumn(name = "subcategory")	
	private SubCategory subCategory;

	public Double getNaturalValue() {
		double res = value;
		res /= 100;
		return res;
	}

	public void setNatural(Double val) {
		val *= 100;
		value =(val.intValue());
	}
	
	public LocalDate getStatsDay()  {
		return plan == null ? accountrecord.getExecuted() : plan.getPlanDate();
		
	}
}
