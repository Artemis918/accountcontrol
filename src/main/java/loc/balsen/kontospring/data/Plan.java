package loc.balsen.kontospring.data;

import java.time.LocalDate;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;

import lombok.Data;

@Data
@Entity
public class Plan {

	public enum MatchStyle {
		EXACT, /// Der Wert des Belegs muß identisch sein
		MAX, /// Der Wert des Belegs darf nicht höher sein
		SUMMAX, /// Der Wert wird nur in der Summe berücksichtigt
		PATTERN /// Es wird nur das Pattern für die Zuordnung verwendet
	}

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_plan_name")
	@SequenceGenerator(name = "seq_plan_name", sequenceName = "seq_plan", allocationSize = 1)
	private int id;
	private LocalDate creationDate;
	private LocalDate startDate;
	private LocalDate planDate;
	private LocalDate endDate;
	private LocalDate deactivateDate;
	private int position;
	private int wert;
	private String shortDescription;
	private String description;
	private MatchStyle matchStyle;

	@NotNull
	private String pattern;
	
	@ManyToOne
	@JoinColumn(name = "template")
	private Template template;

	@ManyToOne
	@NotNull
	@JoinColumn(name = "konto")
	private SubCategory subCategory;

	@Transient
	private Pattern matcher;

	public Plan() {
	}

	public Plan(Template templ, LocalDate date) {

		creationDate = LocalDate.now();

		startDate = date.minusDays(templ.getVardays());
		planDate = date;
		endDate = date.plusDays(templ.getVardays());

		subCategory = templ.getSubCategory();
		position = templ.getPosition();
		wert = templ.getValue();
		pattern = templ.getPattern();
		shortDescription = templ.getShortDescription();
		description = templ.getDescription();
		matchStyle = templ.getMatchStyle();
		template = templ;

		matcher = null;
	}

	public boolean isInPeriod(LocalDate beleg) {
		return (startDate==null || !beleg.isBefore(startDate)) && (endDate==null || !beleg.isAfter(endDate));
	}

	public boolean matches(BuchungsBeleg beleg) {
		if (matcher == null)
			matcher = new Pattern(pattern);
		return matcher.matches(beleg);
	}

	public Pattern getPatternObject() {
		return new Pattern(pattern);
	}

	public void setPattern(Pattern p) {
		pattern = p.toJson();
	}
}
