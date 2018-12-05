package loc.balsen.kontospring.templates;

import java.text.SimpleDateFormat;

import loc.balsen.kontospring.data.Template;
import lombok.Data;

@Data
public class TemplateSmallDTO {

	static private final SimpleDateFormat dateFormatter = new SimpleDateFormat("dd.MM.YYYY");
	
	private int id;
	private String gueltigVon;
	private String gueltigBis;
	private String rhythm;
	private String shortdescription;
	private Integer betrag;
	
	public TemplateSmallDTO(Template template) {
		
		id =  template.getId();
		gueltigVon = dateFormatter.format(template.getGueltigVon());
		gueltigBis = template.getGueltigBis()==null ? null :dateFormatter.format(template.getGueltigBis());
		shortdescription = template.getShortDescription();
		betrag = template.getWert();
		
		rhythm = template.getRythmus().toString() + " (" + template.getAnzahlRythmus() + ")";
	}	
}
