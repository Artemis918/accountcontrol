package loc.balsen.accountcontrol.dto;

import loc.balsen.accountcontrol.data.Pattern;

public class PatternDTO {

  private String sender;
  private String receiver;
  private String referenceID;
  private String senderID;
  private String details;
  private String mandate;

  public PatternDTO(Pattern pattern) {
    this.sender = pattern.getSender();
    this.receiver = pattern.getReceiver();
    this.referenceID = pattern.getReferenceID();
    this.senderID = pattern.getSenderID();
    this.details = pattern.getDetails();
    this.mandate = pattern.getMandate();
  }

  public Pattern toPattern() {
    return new Pattern(sender, receiver, referenceID, senderID, details, mandate);
  }

  // for serialization only
  //////////////////////////

  public PatternDTO() {}

  public String getSender() {
    return sender;
  }

  public String getReceiver() {
    return receiver;
  }

  public String getReferenceID() {
    return referenceID;
  }

  public String getSenderID() {
    return senderID;
  }

  public String getDetails() {
    return details;
  }

  public String getMandate() {
    return mandate;
  }
}
