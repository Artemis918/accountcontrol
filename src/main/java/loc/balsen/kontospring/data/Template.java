package loc.balsen.kontospring.data;

import java.time.LocalDate;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.NotNull;

import loc.balsen.kontospring.data.Plan.MatchStyle;
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
	private LocalDate validFrom;
	private LocalDate validUntil;
	private LocalDate start;
	private int vardays;
	private int anzahlRythmus;
	private Rythmus rythmus;
	private String description;
	private int position;
	private int value;
	private String shortDescription;
	private Plan.MatchStyle matchStyle;
	private int next;
	
	@NotNull
	private String pattern;
	
	@ManyToOne
	@NotNull
	@JoinColumn(name = "konto")
	private Konto konto;

	public Template() {
		this.id = 0;
		this.validFrom = null;
		this.validUntil= null;
		this.start= null;
		this.vardays= 4;
		this.anzahlRythmus= 0;
		this.rythmus= Rythmus.MONTH;
		this.description= null;
		this.position= 0;
		this.value= 0;
		this.pattern= null;
		this.shortDescription= null;
		this.matchStyle= MatchStyle.EXACT;
		this.next=0;
		this.konto=null;		
	}
	
	public Template (BuchungsBeleg buchungsBeleg) {
		LocalDate plandate = buchungsBeleg.getWertstellung(); 
		this.id = 0;
		this.validFrom = plandate;
		this.validUntil= null;
		this.start= plandate;
		this.vardays= 4;
		this.anzahlRythmus= 0;
		this.rythmus= Rythmus.MONTH;
		this.description= null;
		this.position= 0;
		this.value= buchungsBeleg.getWert();
		this.pattern= (new Pattern(buchungsBeleg)).toJson();
		this.shortDescription= null;
		this.matchStyle= MatchStyle.EXACT;
		this.next=0;
		this.konto=null;	
	}

	/**
	 * @param t
	 */
	public void set(Template t) {
		this.id = t.id;
		this.validFrom = t.validFrom;
		this.validUntil= t.validUntil;
		this.start= t.start;
		this.vardays= t.vardays;
		this.anzahlRythmus= t.anzahlRythmus;
		this.rythmus= t.rythmus;
		this.description= t.description;
		this.position= t.position;
		this.value= t.value;
		this.pattern= t.pattern;
		this.shortDescription= t.shortDescription;
		this.matchStyle= t.matchStyle;
		this.next= t.next;
		this.konto= t.konto;
	}

	public LocalDate increaseDate(LocalDate last) {
		if (last != null) {
			switch (rythmus) {
			case DAY:
				return last.plusDays(anzahlRythmus);
			case MONTH:
				return last.plusMonths(anzahlRythmus);
			case WEEK:
				return last.plusWeeks(anzahlRythmus);
			case YEAR:
				return last.plusYears(anzahlRythmus);
			}
		}
		return start;			
	}
	
	public Pattern getPatternObject() {
		return new Pattern(pattern);
	}

	public void setPattern(Pattern p) {
		pattern = p.toJson();
	}

	public Template copy(int wert, LocalDate startDate) {
		Template result = new Template();
		result.set(this);
		result.setValue(wert);;
		result.setValidFrom(startDate);
		return result;
	}
	
	public boolean equalsExceptValidPeriod(Template t) {
		return this.id == t.id
				&& this.start.equals(t.start)
				&& this.vardays  == t.vardays
				&& this.anzahlRythmus == t.anzahlRythmus
				&& this.rythmus == t.rythmus
				&& this.description.equals(t.description)
				&& this.position == t.position
				&& this.value == t.value
				&& this.pattern.equals(t.pattern)
                && this.shortDescription.equals(t.shortDescription)
                && this.matchStyle == t.matchStyle
                && this.next == t.next
                && this.konto == t.konto;
	}
}
