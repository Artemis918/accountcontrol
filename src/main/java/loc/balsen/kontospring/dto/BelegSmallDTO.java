package loc.balsen.kontospring.dto;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import loc.balsen.kontospring.data.BuchungsBeleg;
import lombok.Data;

@Data
public class BelegSmallDTO {

	private String details;
	private Integer betrag;
	private String date;
	private String partner;
	
	public BelegSmallDTO(BuchungsBeleg beleg) {
		
		betrag = beleg.getWert();
		
		if ( beleg.getWert() > 0) {
			partner = beleg.getAbsender(); 
		}
		else {
			partner = beleg.getEmpfaenger();
		}

		
		details = beleg.getDetails();
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
		LocalDate wertstellung = beleg.getWertstellung();
		if (wertstellung == null )
			wertstellung = beleg.getBeleg();
		date =  beleg.getWertstellung().format(formatter );
	}
}
