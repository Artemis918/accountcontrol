package loc.balsen.kontospring.data;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class Pattern {

	private String sender;
	private String receiver;
	private String referenceID;
	private String senderID;
	private String details;
	private String mandate;

	static private final ObjectMapper mapper = new ObjectMapper();

	public Pattern() {
		sender = "";
		receiver = "";
		referenceID = "";
		senderID = "";
		details = "";
		mandate = "";
	};

	private String getField(JsonNode p, String fieldname) {
		JsonNode res = p.get(fieldname);
		return (res == null) ? "" : res.asText();
	}

	public Pattern(String jsonString) {
		try {
			JsonNode p = mapper.readTree(jsonString);
			this.sender = getField(p, "sender");
			this.receiver = getField(p, "receiver");
			this.referenceID = getField(p, "referenceID");
			this.senderID = getField(p, "senderID");
			this.details = getField(p, "details");
			this.mandate = getField(p, "mandate");

			// some old data from previous versions
			if (this.mandate.isEmpty()) {
				this.mandate = getField(p, "mandat");
			}

		} catch (IOException e) {
			// TODO generate some log
			sender = "";
			receiver = "";
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

	public Pattern(String sender, String receiver, String referenceID, String senderID, String details,
			String mandate) {
		this.sender = sender;
		this.receiver = receiver;
		this.referenceID = referenceID;
		this.senderID = senderID;
		this.details = details;
		this.mandate = mandate;
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
		return matches(sender, record.getSender()) && matches(receiver, record.getReceiver())
				&& matches(referenceID, record.getReference()) && matches(senderID, record.getSubmitter())
				&& matches(details, record.getDetailsNOLF()) && matches(mandate, record.getMandate());
	}

	private boolean matches(String pattern, String text) {
		if (pattern == null || pattern.isEmpty())
			return true;

		return text != null && !text.isEmpty() && text.contains(pattern);
	}

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
