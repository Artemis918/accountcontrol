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

	public enum TimeUnit {
		DAY, WEEK, MONTH, YEAR
	}

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_template_name")
	@SequenceGenerator(name = "seq_template_name", sequenceName = "seq_template", allocationSize = 1)
	private int id;
	private LocalDate validFrom;
	private LocalDate validUntil;
	private LocalDate start;
	private int variance;
	private int repeatCount;
	private TimeUnit repeatUnit;
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
	@JoinColumn(name = "subcategory")
	private SubCategory subCategory;

	public Template() {
		this.id = 0;
		this.validFrom = null;
		this.validUntil= null;
		this.start= null;
		this.variance= 4;
		this.repeatCount= 0;
		this.repeatUnit= TimeUnit.MONTH;
		this.description= null;
		this.position= 0;
		this.value= 0;
		this.pattern= null;
		this.shortDescription= null;
		this.matchStyle= MatchStyle.EXACT;
		this.next=0;
		this.subCategory=null;		
	}
	
	public Template (AccountRecord accountRecord) {
		LocalDate plandate = accountRecord.getExecuted(); 
		this.id = 0;
		this.validFrom = plandate;
		this.validUntil= null;
		this.start= plandate;
		this.variance= 4;
		this.repeatCount= 0;
		this.repeatUnit= TimeUnit.MONTH;
		this.description= null;
		this.position= 0;
		this.value= accountRecord.getValue();
		this.pattern= (new Pattern(accountRecord)).toJson();
		this.shortDescription= null;
		this.matchStyle= MatchStyle.EXACT;
		this.next=0;
		this.subCategory=null;	
	}

	/**
	 * @param t
	 */
	public void set(Template t) {
		this.id = t.id;
		this.validFrom = t.validFrom;
		this.validUntil= t.validUntil;
		this.start= t.start;
		this.variance= t.variance;
		this.repeatCount= t.repeatCount;
		this.repeatUnit= t.repeatUnit;
		this.description= t.description;
		this.position= t.position;
		this.value= t.value;
		this.pattern= t.pattern;
		this.shortDescription= t.shortDescription;
		this.matchStyle= t.matchStyle;
		this.next= t.next;
		this.subCategory= t.subCategory;
	}

	public LocalDate increaseDate(LocalDate last) {
		if (last != null) {
			switch (repeatUnit) {
			case DAY:
				return last.plusDays(repeatCount);
			case MONTH:
				return last.plusMonths(repeatCount);
			case WEEK:
				return last.plusWeeks(repeatCount);
			case YEAR:
				return last.plusYears(repeatCount);
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

	public Template copy() {
		Template result = new Template();
		result.set(this);
		return result;
	}
	
	public boolean equalsExceptValidPeriod(Template t) {
		return this.id == t.id
				&& this.start.equals(t.start)
				&& this.variance  == t.variance
				&& this.repeatCount == t.repeatCount
				&& this.repeatUnit == t.repeatUnit
				&& this.description.equals(t.description)
				&& this.position == t.position
				&& this.value == t.value
				&& this.pattern.equals(t.pattern)
                && this.shortDescription.equals(t.shortDescription)
                && this.matchStyle == t.matchStyle
                && this.next == t.next
                && this.subCategory == t.subCategory;
	}
}
