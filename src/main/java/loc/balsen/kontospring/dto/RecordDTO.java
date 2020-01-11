package loc.balsen.kontospring.dto;

import java.time.LocalDate;

import loc.balsen.kontospring.data.AccountRecord;
import loc.balsen.kontospring.data.AccountRecord.Type;
import lombok.Data;

@Data
public class RecordDTO {

	private int id;
	private LocalDate eingang;
	private LocalDate creation;
	private LocalDate wertstellung;
	private Type type;
	private String absender;
	private String empfaenger;
	private int wert;
	private String details;
	private String einreicherId;
	private String mandat;
	private String referenz;

	public RecordDTO() {
	}

	public RecordDTO(AccountRecord record) {
		this.id = record.getId();
		this.eingang = record.getEingang();
		this.creation = record.getCreation();
		this.wertstellung = record.getWertstellung();
		this.type = record.getType();
		this.absender = record.getAbsender();
		this.empfaenger = record.getEmpfaenger();
		this.wert = record.getWert();
		this.details = record.getDetails();
		this.einreicherId = record.getEinreicherId();
		this.mandat = record.getMandat();
		this.referenz = record.getReferenz();
	}

	public AccountRecord toRecord() {
		AccountRecord record = new AccountRecord();
		record.setId(id);
		record.setEingang(eingang);
		record.setCreation(this.creation);
		record.setWertstellung(wertstellung);
		record.setType(type);
		record.setAbsender(absender);
		record.setEmpfaenger(empfaenger);
		record.setWert(wert);
		record.setDetails(details);
		record.setEinreicherId(einreicherId);
		record.setMandat(mandat);
		record.setReferenz(referenz);

		return record;
	}

	public String getPartner() {
		if (wert > 0) {
			return absender;
		} else {
			return empfaenger;
		}
	}
}
