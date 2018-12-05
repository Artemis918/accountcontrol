package loc.balsen.kontospring.templates;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.Template;
import loc.balsen.kontospring.data.Template.Rythmus;
import loc.balsen.kontospring.repositories.KontoRepository;
import lombok.Data;

@Data
public class TemplateDTO {
	private int id;
	private Date gueltigVon;
	private Date gueltigBis;
	private Date start;
	private int vardays;
	private int anzahlRythmus;
	private int rythmus;
	private Long konto;
	private int kontogroup;
	private String description;
	private int position;
	private int wert;
	private PatternDTO pattern;
	private String shortdescription;
	private int matchStyle;
	private int previous;	

	static private final SimpleDateFormat dateFormatter = new SimpleDateFormat("dd.MM.YYYY");	
	static private final ObjectMapper mapper =  new ObjectMapper();

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
		this.pattern = toPatternDTO(template.getPattern());
		this.shortdescription = template.getShortDescription();
		this.matchStyle = template.getMatchStyle().ordinal();
		this.previous = template.getNext();
	}
	
	public Template toTemplate(KontoRepository kontoRepository) throws ParseException {
		Template template = new Template();

		template.setId(this.getId());
		template.setGueltigVon(this.gueltigVon == null ? new Date(): this.gueltigVon);
		template.setGueltigBis(this.gueltigBis);
		template.setStart(this.start == null ? new Date(): this.start);
		template.setVardays(this.getVardays());
		template.setAnzahlRythmus(this.getAnzahlRythmus());
		template.setRythmus(Rythmus.values()[this.rythmus]);
		template.setDescription(this.getDescription());
		template.setPosition(this.getPosition());
		template.setWert(this.getWert());
		template.setKonto(kontoRepository.getOne(this.konto));
		template.setPattern(toJson(this.getPattern()));
		template.setShortDescription(this.getShortdescription());
		template.setMatchStyle(Plan.MatchStyle.values()[this.matchStyle]);
		template.setNext(this.getPrevious());

		return template;
	}
	
	public String toJson(PatternDTO patterndto) {
		try {
			return mapper.writeValueAsString(patterndto);
		} catch (JsonProcessingException e) {
			// TODO create some log
			e.printStackTrace();
		}
		return "";
	}
	
	public PatternDTO toPatternDTO(String patternjson) {
		try {
			return mapper.readValue(patternjson, PatternDTO.class);
		} catch (JsonProcessingException e) {
			// TODO create some log
			e.printStackTrace();
		}
		catch(IOException e) {
			// TODO create some log
			e.printStackTrace();
		}
		return new PatternDTO();
	}

}
