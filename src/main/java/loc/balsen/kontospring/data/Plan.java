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

	public enum MatchStyle {
		EXACT,  /// Der Wert des Belegs muß identisch sein
		MAX,    /// Der Wert des Belegs darf nicht höher sein
		SUMMAX, /// Der Wert wird nur in der Summe berücksichtigt
		PATTERN /// Es wird nur das Pattern für die Zuordnung verwendet 
	}
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_plan_name")
	@SequenceGenerator(name = "seq_plan_name", sequenceName = "seq_plan", allocationSize = 1)
	private int id;
	private Date creationDate;
	private Date startDate;
	private Date planDate;
	private Date endDate;
	private int position;
	private int wert;
	private String pattern;
	private String shortDescription;
	private String description;
	private MatchStyle matchStyle;
	
	@ManyToOne
	@JoinColumn(name = "template")
	private Template template;

	@ManyToOne
	@JoinColumn(name = "konto")
	private Konto konto;

	public Plan() {
	}
	
	public Plan(Template templ, Date date) {

		creationDate = new Date();

		planDate = date;

		setPeriod(templ);

		konto = templ.getKonto();
		position = templ.getPosition();
		wert = templ.getWert();
		pattern = templ.getPattern();
		shortDescription = templ.getShortDescription();
		description = templ.getDescription();
		matchStyle = templ.getMatchStyle();
		template = templ;
	}

	private void setPeriod(Template templ) {

		Calendar cal = Calendar.getInstance();

		cal.setTime(planDate);
		cal.add(Calendar.DATE, templ.getVardays());
		endDate = cal.getTime();

		cal.setTime(planDate);
		cal.add(Calendar.DATE, -1 * templ.getVardays());
		startDate = cal.getTime();
	}
}
