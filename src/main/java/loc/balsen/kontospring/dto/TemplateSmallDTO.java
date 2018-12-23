package loc.balsen.kontospring.dto;

import java.time.format.DateTimeFormatter;

import loc.balsen.kontospring.data.Template;
import lombok.Data;

@Data
public class TemplateSmallDTO {

	static private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd.MM.YYYY");
	
	private int id;
	private String gueltigVon;
	private String gueltigBis;
	private String rhythm;
	private String shortdescription;
	private Integer betrag;
	
	public TemplateSmallDTO(Template template) {
		
		id =  template.getId();
		gueltigVon = template.getGueltigVon().format(dateFormatter);
		gueltigBis = template.getGueltigBis()==null ? null :template.getGueltigBis().format(dateFormatter);
		shortdescription = template.getShortDescription();
		betrag = template.getWert();
		
		rhythm = template.getRythmus().toString() + " (" + template.getAnzahlRythmus() + ")";
	}	
}
