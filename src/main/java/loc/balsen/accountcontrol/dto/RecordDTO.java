package loc.balsen.accountcontrol.dto;

import java.time.LocalDate;
import java.util.ArrayList;
import loc.balsen.accountcontrol.data.AccountRecord;
import loc.balsen.accountcontrol.data.AccountRecord.Type;

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

  public RecordDTO() {}

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
    ArrayList<String> detailslist = new ArrayList<>();
    detailslist.add(details);
    return new AccountRecord(id, received, created, executed, type, sender, receiver, getValue(),
        detailslist, submitter, mandate, reference);
  }

  public String getPartner() {
    if (getValue() > 0) {
      return sender;
    } else {
      return receiver;
    }
  }

  // for serialization only
  ///////////////////////////// 7
  public int getId() {
    return id;
  }

  public LocalDate getReceived() {
    return received;
  }

  public LocalDate getCreated() {
    return created;
  }

  public LocalDate getExecuted() {
    return executed;
  }

  public Type getType() {
    return type;
  }

  public String getSender() {
    return sender;
  }

  public String getReceiver() {
    return receiver;
  }

  public int getValue() {
    return value;
  }

  public String getDetails() {
    return details;
  }

  public String getSubmitter() {
    return submitter;
  }

  public String getMandate() {
    return mandate;
  }

  public String getReference() {
    return reference;
  }
}
