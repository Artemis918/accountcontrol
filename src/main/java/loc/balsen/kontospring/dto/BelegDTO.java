package loc.balsen.kontospring.dto;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import loc.balsen.kontospring.data.BuchungsBeleg;
import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.BuchungsBeleg.Art;
import loc.balsen.kontospring.repositories.KontoRepository;
import loc.balsen.kontospring.repositories.TemplateRepository;
import lombok.Data;

@Data
public class BelegDTO {

	private int id;
	private LocalDate eingang;
	private LocalDate beleg;
	private LocalDate wertstellung;
	private Art art;
	private String absender;
	private String empfaenger;
	private int wert;
	private String details;
	private String einreicherId;
	private String mandat;
	private String referenz;
	
	public BelegDTO() {
	}
	
	public BelegDTO(BuchungsBeleg beleg) {
		this.id = beleg.getId();
		this.eingang = beleg.getEingang();
		this.beleg = beleg.getBeleg();
		this.wertstellung = beleg.getWertstellung();
		this.art = beleg.getArt();
		this.absender = beleg.getAbsender();
		this.empfaenger = beleg.getEmpfaenger();
		this.wert = beleg.getWert();
		this.details = beleg.getDetails();
		this.einreicherId = beleg.getEinreicherId();
		this.mandat =  beleg.getMandat();
		this.referenz = beleg.getReferenz();
	}
		
	public BuchungsBeleg toBeleg() {
		BuchungsBeleg beleg = new BuchungsBeleg();
		beleg.setId(id);
		beleg.setEingang(eingang);
		beleg.setBeleg(this.beleg);
		beleg.setWertstellung(wertstellung);
		beleg.setArt(art);
		beleg.setAbsender(absender);
		beleg.setEmpfaenger(empfaenger);
		beleg.setWert(wert);
		beleg.setDetails(details);
		beleg.setEinreicherId(einreicherId);
		beleg.setMandat(mandat);
		beleg.setReferenz(referenz);
		
		return beleg;		
	}

}
