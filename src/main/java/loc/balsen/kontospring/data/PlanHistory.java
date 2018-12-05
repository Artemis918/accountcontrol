package loc.balsen.kontospring.data;

import java.util.Calendar;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import lombok.Data;

@Data
@Entity
public class PlanHistory {

	@Id
	private int id;
	private Date creationDate;
	private Date deactivateDate;
	private Date startDate;
	private Date planDate;
	private Date endDate;
	private int position;
	private int wert;
	private String pattern;
	private String shortDescription;
	private String description;
    private Plan.MatchStyle matchStyle;
	private int template;

	@ManyToOne
	@JoinColumn(name = "konto")
	private Konto konto;
	
	
	public PlanHistory() {
	}
	
	public PlanHistory(Plan p) {
        
		id = p.getId();
		creationDate = p.getCreationDate();
		planDate = p.getPlanDate();
		startDate = p.getStartDate();
		endDate = p.getEndDate();
		konto = p.getKonto();
		position = p.getPosition();
		wert = p.getWert();
		pattern = p.getPattern();
		shortDescription = p.getShortDescription();
		description = p.getDescription();
		matchStyle = p.getMatchStyle();
		if (p.getTemplate() != null)
			template = p.getTemplate().getId();
		
		deactivateDate = Calendar.getInstance().getTime();
	}

	@Override
	public boolean equals(Object k) {
		if (!(k instanceof PlanHistory)) return false;
		return this.getId() == ((PlanHistory)k).getId();
	}
}
