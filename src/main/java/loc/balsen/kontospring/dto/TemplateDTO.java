package loc.balsen.kontospring.dto;

import java.time.LocalDate;

import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.Template;
import loc.balsen.kontospring.data.Template.Rythmus;
import loc.balsen.kontospring.repositories.KontoRepository;
import lombok.Data;

@Data
public class TemplateDTO {
	private int id;
	private LocalDate validFrom;
	private LocalDate validUntil;
	private LocalDate start;
	private int vardays;
	private int anzahl;
	private int rythmus;
	private String rythmName;
	private int konto;
	private int kontogroup;
	private String description;
	private int position;
	private int value;
	private PatternDTO pattern;
	private String shortdescription;
	private int matchstyle;
	private int previous;	

	public TemplateDTO() {
	}
	
	public TemplateDTO(Template template) {
				
		this.id = template.getId();
		this.validFrom = template.getValidFrom();
		this.validUntil = template.getValidUntil();
		this.start = template.getStart();
		this.vardays=template.getVardays();
		this.anzahl = template.getAnzahlRythmus();
		this.rythmus = template.getRythmus().ordinal();
		this.description = template.getDescription();
		this.position= template.getPosition();
		this.konto=template.getKonto().getId();		
		this.kontogroup=template.getKonto().getKontoGruppe().getId();
		this.value = template.getValue();
		this.pattern = new PatternDTO(template.getPatternObject());
		this.shortdescription = template.getShortDescription();
		this.matchstyle = template.getMatchStyle().ordinal();
		this.previous = template.getNext();
		
		this.rythmName = template.getAnzahlRythmus() + " - " + template.getRythmus().toString();
	}
	
	public Template toTemplate(KontoRepository kontoRepository) {
		Template template = new Template();

		template.setId(this.getId());
		template.setValidFrom(this.validFrom == null ? LocalDate.now(): this.validFrom);
		template.setValidUntil(this.validUntil);
		template.setStart(this.start == null ? LocalDate.now() : this.start);
		template.setVardays(this.getVardays());
		template.setAnzahlRythmus(this.getAnzahl());
		template.setRythmus(Rythmus.values()[this.rythmus]);
		template.setDescription(this.getDescription());
		template.setPosition(this.getPosition());
		template.setValue(this.getValue());
		template.setKonto(kontoRepository.getOne(this.konto));
		template.setPattern(pattern.toPattern());
		template.setShortDescription(this.getShortdescription());
		template.setMatchStyle(Plan.MatchStyle.values()[this.matchstyle]);
		template.setNext(this.getPrevious());

		return template;
	}
	

}
