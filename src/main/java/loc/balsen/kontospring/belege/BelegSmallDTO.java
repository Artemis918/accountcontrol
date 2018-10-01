package loc.balsen.kontospring.belege;

import java.text.SimpleDateFormat;

import loc.balsen.kontospring.data.Beleg;
import lombok.Data;

@Data
public class BelegSmallDTO {

	private String details;
	private Integer betrag;
	private String date;
	private String partner;
	
	public BelegSmallDTO(Beleg beleg) {
		
		SimpleDateFormat dateFormatter = new SimpleDateFormat("dd.MM.YYYY");
		betrag = beleg.getWert();
		
		if ( beleg.getWert() > 0) {
			partner = beleg.getAbsender(); 
		}
		else {
			partner = beleg.getEmpfaenger();
		}

		details = beleg.getDetails();
		date =  dateFormatter.format(beleg.getWertstellung());
	}
}
