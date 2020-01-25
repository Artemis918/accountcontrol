package loc.balsen.kontospring.data;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.Data;

@Data
public class Pattern {

	private String sender;
	private String receiver;
	private String referenceID;
	private String senderID;
	private String details;
	private String mandate;
	
	static private final ObjectMapper mapper =  new ObjectMapper();
	
	public Pattern() {
		sender = "";
		receiver= "";
		referenceID = "";
		senderID = ""; 
		details = "";
		mandate = "";
	};

	public Pattern(String jsonString) {
		try {
			Pattern p = mapper.readValue(jsonString, Pattern.class);
			this.sender = p.sender;
			this.receiver = p.receiver;
			this.referenceID = p.referenceID;
			this.senderID = p.senderID;
			this.details = p.details;
			this.mandate = p.mandate;
			
		} catch (IOException e) {
			// TODO generate some log
			sender = "";
			receiver= "";
			referenceID = "";
			senderID = ""; 
			details = "";
			mandate = "";
		}
	}
	
	public Pattern(AccountRecord accountRecord) {
		this.sender = accountRecord.getSender();
		this.receiver = accountRecord.getReceiver();
		this.referenceID = accountRecord.getReference();
		this.senderID = accountRecord.getSubmitter();
		this.details = accountRecord.getDetails();
		this.mandate = accountRecord.getMandate();
	}

	public String toJson() {
		try {
			return mapper.writeValueAsString(this);
		} catch (JsonProcessingException e) {
			// TODO create some log
			e.printStackTrace();
		}
		return "";
	}

	public boolean matches(AccountRecord record) {
		return matches(sender,record.getSender()) 
				&& matches(receiver, record.getReceiver())
				&& matches(referenceID , record.getReference())
				&& matches(senderID , record.getSubmitter())
				&& matches(details , record.getDetailsNOLF())
				&& matches(mandate , record.getMandate());
	}

	private boolean matches(String pattern, String text) {
		return ((text  == null || text.isEmpty()) && (pattern == null || pattern.isEmpty()) ) || text.contains(pattern);
	}
}
