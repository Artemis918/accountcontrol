package loc.balsen.kontospring.data;

import java.util.Calendar;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;

import loc.balsen.kontospring.data.Plan.Art;
import lombok.Data;

@Data
@Entity
public class Template {

	public enum Rythmus {
		DAY, WEEK, MONTH, YEAR
	}

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_template_name")
	@SequenceGenerator(name = "seq_template_name", sequenceName = "seq_template", allocationSize = 1)
	private int id;
	private Date gueltigVon;
	private Date gueltigBis;
	private Date start;
	private int vardays;
	private int anzahlRythmus;
	private Rythmus rythmus;
	private String description;
	private int position;
	private int wert;
	private String pattern;
	private String shortdescription;
	private Plan.Art planArt;
	private int next;

	@ManyToOne
	@JoinColumn(name = "konto")
	private Konto konto;

	public Template() {
		this.id = 0;
		this.gueltigVon = null;
		this.gueltigBis= null;
		this.start= null;
		this.vardays= 4;
		this.anzahlRythmus= 0;
		this.rythmus= Rythmus.MONTH;
		this.description= null;
		this.position= 0;
		this.wert= 0;
		this.pattern= null;
		this.shortdescription= null;
		this.planArt= Art.EXACT;
		this.next=0;
		this.konto=null;		
	}
	
	public Template (Template t) {
		set(t);		
	}

	/**
	 * @param t
	 */
	public void set(Template t) {
		this.id = t.id;
		this.gueltigVon = t.gueltigVon;
		this.gueltigBis= t.gueltigBis;
		this.start= t.start;
		this.vardays= t.vardays;
		this.anzahlRythmus= t.anzahlRythmus;
		this.rythmus= t.rythmus;
		this.description= t.description;
		this.position= t.position;
		this.wert= t.wert;
		this.pattern= t.pattern;
		this.shortdescription= t.shortdescription;
		this.planArt= t.planArt;
		this.next= t.next;
		this.konto= t.konto;
	}


	public Double getEuroWert() {
		double res = getWert();
		res /= 100;
		return res;
	}

	public void setEuroWert(Double val) {
		val *= 100;
		setWert(val.intValue());
	}

	public Date incrementDate(Date nextDate) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(nextDate);
		switch (rythmus) {
		case WEEK: {
			cal.add(Calendar.WEEK_OF_YEAR, anzahlRythmus);
			break;
		}
		case DAY: {
			cal.add(Calendar.DAY_OF_MONTH, anzahlRythmus);
			break;
		}
		case MONTH: {
			cal.add(Calendar.MONTH, anzahlRythmus);
			break;
		}
		case YEAR: {
			cal.add(Calendar.YEAR, anzahlRythmus);
			break;
		}

		default:
			break;
		}
		return cal.getTime();
	}
}
