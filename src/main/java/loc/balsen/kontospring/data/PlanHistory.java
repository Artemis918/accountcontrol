package loc.balsen.kontospring.data;

import java.util.Calendar;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
public class PlanHistory {

	@Id
	private int id;
	private Date creationdate;
	private Date deactivatedate;
	private Date startdate;
	private Date plandate;
	private Date enddate;
	private int position;
	private int wert;
	private String pattern;
	private String shortdescription;
	private String description;
    private Plan.Art planArt;
	private int template;

	@ManyToOne
	@JoinColumn(name = "konto")
	private Konto konto;
	
	
	public PlanHistory() {
	}
	
	public PlanHistory(Plan p) {
        
		id = p.getId();
		creationdate = p.getCreationdate();
		plandate = p.getPlandate();
		startdate = p.getStartdate();
		enddate = p.getEnddate();
		konto = p.getKonto();
		position = p.getPosition();
		wert = p.getWert();
		pattern = p.getPattern();
		shortdescription = p.getShortdescription();
		description = p.getDescription();
		planArt = p.getPlanArt();
		if (p.getTemplate() != null)
			template = p.getTemplate().getId();
		
		deactivatedate = Calendar.getInstance().getTime();
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Date getCreationdate() {
		return creationdate;
	}

	public void setCreationdate(Date creationdate) {
		this.creationdate = creationdate;
	}

	public Date getDeactivatedate() {
		return deactivatedate;
	}

	public void setDeactivatedate(Date deactivatedate) {
		this.deactivatedate = deactivatedate;
	}

	public Date getStartdate() {
		return startdate;
	}

	public void setStartdate(Date startdate) {
		this.startdate = startdate;
	}

	public Date getPlandate() {
		return plandate;
	}

	public void setPlandate(Date plandate) {
		this.plandate = plandate;
	}

	public Date getEnddate() {
		return enddate;
	}

	public void setEnddate(Date enddate) {
		this.enddate = enddate;
	}

	public int getPosition() {
		return position;
	}

	public void setPosition(int position) {
		this.position = position;
	}

	public int getWert() {
		return wert;
	}

	public void setWert(int wert) {
		this.wert = wert;
	}

	public String getPattern() {
		return pattern;
	}

	public void setPattern(String pattern) {
		this.pattern = pattern;
	}

	public String getShortdescription() {
		return shortdescription;
	}

	public void setShortdescription(String shortdescription) {
		this.shortdescription = shortdescription;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public int getTemplate() {
		return template;
	}

	public void setTemplate(int template) {
		this.template = template;
	}

	public Konto getKonto() {
		return konto;
	}

	public void setKonto(Konto konto) {
		this.konto = konto;
	}
	
	public Plan.Art getPlanArt() {
		return planArt;
	}

	public void setPlanArt(Plan.Art planArt) {
		this.planArt = planArt;
	}

	@Override
	public boolean equals(Object k) {
		if (!(k instanceof PlanHistory)) return false;
		return this.getId() == ((PlanHistory)k).getId();
	}
}
