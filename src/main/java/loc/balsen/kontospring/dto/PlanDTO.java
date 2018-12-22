package loc.balsen.kontospring.dto;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;

import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.Plan.MatchStyle;
import loc.balsen.kontospring.repositories.KontoRepository;
import loc.balsen.kontospring.repositories.TemplateRepository;
import lombok.Data;

@Data
public class PlanDTO {

	@Autowired
	KontoRepository kontoRepository;
	
	@Autowired
	TemplateRepository templateRepository;
	
	private int id;
	private LocalDate creationDate;
	private LocalDate startDate;
	private LocalDate planDate;
	private LocalDate endDate;
	private int position;
	private int wert;
	private PatternDTO patternDTO;
	private String shortDescription;
	private String description;
	private MatchStyle matchStyle;
	private int idTemplate;
	private int idKonto;
	
	public PlanDTO(Plan plan) {
		this.id=plan.getId();
		this.creationDate=plan.getCreationDate();
		this.startDate=plan.getStartDate();
		this.planDate=plan.getPlanDate();
		this.endDate=plan.getEndDate();
		this.position=plan.getPosition();
		this.wert=plan.getWert();
		this.patternDTO=new PatternDTO(plan.getPatternObject());
		this.shortDescription=plan.getShortDescription();
		this.description=plan.getDescription();
		this.matchStyle=plan.getMatchStyle();
		this.idTemplate=plan.getTemplate().getId();
		this.idKonto=plan.getKonto().getId();
	}
	
	public Plan toPlan() {
		Plan plan = new Plan();
		plan.setId(id);
		plan.setCreationDate(creationDate);
		plan.setStartDate(startDate);
		plan.setPlanDate(planDate);
		plan.setEndDate(endDate);
		plan.setPosition(position);
		plan.setWert(wert);
		plan.setPattern(patternDTO.toPattern());
		plan.setShortDescription(shortDescription);
		plan.setDescription(description);
		plan.setMatchStyle(matchStyle);
		plan.setKonto(kontoRepository.findById(idKonto).get());
		plan.setTemplate(templateRepository.findById(idTemplate).get());
		return plan;
	}
	
	
	
}
