package loc.balsen.kontospring.dto;

import java.time.LocalDate;

import loc.balsen.kontospring.data.AccountRecord;
import loc.balsen.kontospring.data.AccountRecord.Type;
import lombok.Data;

@Data
public class RecordDTO {

	private int id;
	private LocalDate received;
	private LocalDate created;
	private LocalDate executed;
	private Type type;
	private String sender;
	private String receiver;
	private int value;
	private String details;
	private String submitter;
	private String mandate;
	private String reference;

	public RecordDTO() {
	}

	public RecordDTO(AccountRecord record) {
		this.id = record.getId();
		this.received = record.getReceived();
		this.created = record.getCreated();
		this.executed = record.getExecuted();
		this.type = record.getType();
		this.sender = record.getSender();
		this.receiver = record.getReceiver();
		this.value = record.getValue();
		this.details = record.getDetails();
		this.submitter = record.getSubmitter();
		this.mandate = record.getMandate();
		this.reference = record.getReference();
	}

	public AccountRecord toRecord() {
		AccountRecord record = new AccountRecord();
		record.setId(id);
		record.setReceived(received);
		record.setCreated(this.created);
		record.setExecuted(executed);
		record.setType(type);
		record.setSender(sender);
		record.setReceiver(receiver);
		record.setValue(value);
		record.setDetails(details);
		record.setSubmitter(submitter);
		record.setMandate(mandate);
		record.setReference(reference);

		return record;
	}

	public String getPartner() {
		if (value > 0) {
			return sender;
		} else {
			return receiver;
		}
	}
}
