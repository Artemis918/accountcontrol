package loc.balsen.kontospring.dto;

import loc.balsen.kontospring.data.Pattern;
import lombok.Data;

@Data
public class PatternDTO {

	
	private String sender;
	private String receiver;
	private String referenceID;
	private String senderID;
	private String details;
	private String mandat;
	
	public PatternDTO() {
	}
	
	public PatternDTO(Pattern pattern) {
		this.sender = pattern.getSender();
		this.receiver = pattern.getReceiver();
		this.referenceID = pattern.getReferenceID();
		this.senderID = pattern.getSenderID();
		this.details = pattern.getDetails();
		this.mandat = pattern.getMandat();
	}
	
	public Pattern toPattern() {
		Pattern pattern = new Pattern("");
		pattern.setSender(sender);
		pattern.setReceiver(receiver);
		pattern.setReferenceID(referenceID);
		pattern.setSenderID(senderID);
		pattern.setDetails(details);
		pattern.setMandat(mandat);
		return pattern;
	}
}
