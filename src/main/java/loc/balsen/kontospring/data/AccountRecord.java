package loc.balsen.kontospring.data;

import java.time.LocalDate;
import java.util.List;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;

@Entity
public class AccountRecord {

  public static String LF = " | ";

  public enum Type {
    CREDIT, DEBIT, DEBITCARD, TRANSFER, CARD, REMUNERATION, PAYINGOUT, STANDINGORDER, MANUEL, REBOOKING, INTEREST, PAYDIREKT
  }

  public static int LEN_DETAILS = 200;
  public static int LEN_SENDER = 80;
  public static int LEN_RECEIVER = 80;

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_accountrecord_name")
  @SequenceGenerator(name = "seq_accountrecord_name", sequenceName = "seq_accountrecord",
      allocationSize = 1)
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


  public AccountRecord() {}

  public AccountRecord(int id, LocalDate received, LocalDate created, LocalDate executed, Type type,
      String sender, String receiver, int value, List<String> details, String submitter,
      String mandate, String reference) {
    this.id = id;
    this.received = received;
    this.created = created;
    this.executed = executed;
    this.type = type;
    this.sender = sender;
    this.receiver = receiver;
    this.value = value;
    this.submitter = submitter;
    this.mandate = mandate;
    this.reference = reference;
    this.details = "";

    if (details != null) {
      for (String detail : details) {
        addDetailLine(detail);
      }
    }
  }

  public void setManuel() {
    this.type = AccountRecord.Type.MANUEL;
    received = LocalDate.now();
  }

  public String getDetailsNOLF() {
    if (details != null)
      return details.replace(LF, "");
    else
      return "";
  }

  private void addDetailLine(String line) {
    if (details == null)
      details = "";

    if (!details.isEmpty())
      details += LF;

    details += line;
  }

  public String getOtherParty() {
    return value > 0 ? sender : receiver;
  }

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
