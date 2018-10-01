package loc.balsen.kontospring.templates;

import java.text.SimpleDateFormat;

import loc.balsen.kontospring.data.Template;
import lombok.Data;

@Data
public class TemplateSmallDTO {
	
	private String gueltigVon;
	private String gueltigBis;
	private String rhythm;
	private String shortdescription;
	private Integer betrag;
	
	public TemplateSmallDTO(Template template) {
		
		SimpleDateFormat dateFormatter = new SimpleDateFormat("dd.MM.YYYY");
		
		gueltigVon = dateFormatter.format(template.getGueltigVon());
		gueltigBis = dateFormatter.format(template.getGueltigBis());
		shortdescription = template.getShortdescription();
		betrag = template.getWert();
		
		rhythm = template.getRythmus().toString() + " (" + template.getAnzahlRythmus() + ")";
	}	
}
