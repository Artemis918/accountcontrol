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

import lombok.Data;

@Data
@Entity
public class Plan {

	public enum Art {
		EXACT,  /// Der Wert des Belegs muß identisch sein
		MAX,    /// Der Wert des Belegs darf nicht höher sein
		SUMMAX, /// Der Wert wird nur in der Summe berücksichtigt
		PATTERN /// Es wird nur das Pattern für die Zuordnung verwendet 
	}
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_plan_name")
	@SequenceGenerator(name = "seq_plan_name", sequenceName = "seq_plan", allocationSize = 1)
	private int id;
	private Date creationdate;
	private Date startdate;
	private Date plandate;
	private Date enddate;
	private int position;
	private int wert;
	private String pattern;
	private String shortdescription;
	private String description;
	private Art planArt;
	
	@ManyToOne
	@JoinColumn(name = "template")
	private Template template;

	@ManyToOne
	@JoinColumn(name = "konto")
	private Konto konto;

	public Plan(Template templ, Date date) {

		creationdate = new Date();

		plandate = date;

		setPeriod(templ);

		konto = templ.getKonto();
		position = templ.getPosition();
		wert = templ.getWert();
		pattern = templ.getPattern();
		shortdescription = templ.getShortdescription();
		description = templ.getDescription();
		planArt = templ.getPlanArt();
		template = templ;
	}

	private void setPeriod(Template templ) {

		Calendar cal = Calendar.getInstance();

		cal.setTime(plandate);
		cal.add(Calendar.DATE, templ.getVardays());
		enddate = cal.getTime();

		cal.setTime(plandate);
		cal.add(Calendar.DATE, -1 * templ.getVardays());
		startdate = cal.getTime();
	}
}
