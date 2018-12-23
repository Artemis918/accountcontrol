package loc.balsen.kontospring.dto;

import java.text.ParseException;
import java.time.LocalDate;

import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.Template;
import loc.balsen.kontospring.data.Template.Rythmus;
import loc.balsen.kontospring.repositories.KontoRepository;
import lombok.Data;

@Data
public class TemplateDTO {
	private int id;
	private LocalDate gueltigVon;
	private LocalDate gueltigBis;
	private LocalDate start;
	private int vardays;
	private int anzahlRythmus;
	private int rythmus;
	private int konto;
	private int kontogroup;
	private String description;
	private int position;
	private int wert;
	private PatternDTO pattern;
	private String shortdescription;
	private int matchStyle;
	private int previous;	

	public TemplateDTO() {
	}
	
	public TemplateDTO(Template template) {
				
		this.id = template.getId();
		this.gueltigVon = template.getGueltigVon();
		this.gueltigBis = template.getGueltigBis();
		this.start = template.getStart();
		this.vardays=template.getVardays();
		this.anzahlRythmus = template.getAnzahlRythmus();
		this.rythmus = template.getRythmus().ordinal();
		this.description = template.getDescription();
		this.position= template.getPosition();
		this.konto=template.getKonto().getId();		
		this.kontogroup=template.getKonto().getKontoGruppe().getId();
		this.wert = template.getWert();
		this.pattern = new PatternDTO(template.getPatternObject());
		this.shortdescription = template.getShortDescription();
		this.matchStyle = template.getMatchStyle().ordinal();
		this.previous = template.getNext();
	}
	
	public Template toTemplate(KontoRepository kontoRepository) throws ParseException {
		Template template = new Template();

		template.setId(this.getId());
		template.setGueltigVon(this.gueltigVon == null ? LocalDate.now(): this.gueltigVon);
		template.setGueltigBis(this.gueltigBis);
		template.setStart(this.start == null ? LocalDate.now() : this.start);
		template.setVardays(this.getVardays());
		template.setAnzahlRythmus(this.getAnzahlRythmus());
		template.setRythmus(Rythmus.values()[this.rythmus]);
		template.setDescription(this.getDescription());
		template.setPosition(this.getPosition());
		template.setWert(this.getWert());
		template.setKonto(kontoRepository.getOne(this.konto));
		template.setPattern(pattern.toPattern());
		template.setShortDescription(this.getShortdescription());
		template.setMatchStyle(Plan.MatchStyle.values()[this.matchStyle]);
		template.setNext(this.getPrevious());

		return template;
	}
	

}
