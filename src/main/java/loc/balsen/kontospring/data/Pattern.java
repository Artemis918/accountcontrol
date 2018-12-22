package loc.balsen.kontospring.data;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import loc.balsen.kontospring.dto.PatternDTO;
import lombok.Data;

@Data
public class Pattern {

	private String sender;
	private String receiver;
	private String referenceID;
	private String senderID;
	private String details;
	private String mandat;
	
	static private final ObjectMapper mapper =  new ObjectMapper();
	
	public Pattern() {
		sender = "";
		receiver= "";
		referenceID = "";
		senderID = ""; 
		details = "";
		mandat = "";
	};

	public Pattern(String jsonString) {
		try {
			Pattern p = mapper.readValue(jsonString, Pattern.class);
			this.sender = p.sender;
			this.receiver = p.receiver;
			this.referenceID = p.referenceID;
			this.senderID = p.senderID;
			this.details = p.details;
			this.mandat = p.mandat;
			
		} catch (IOException e) {
			// TODO generate some log
			sender = "";
			receiver= "";
			referenceID = "";
			senderID = ""; 
			details = "";
			mandat = "";
		}
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

	public boolean matches(BuchungsBeleg beleg) {
		return matches(sender,beleg.getAbsender()) 
				&& matches(receiver, beleg.getEmpfaenger())
				&& matches(referenceID , beleg.getReferenz())
				&& matches(senderID , beleg.getEinreicherId())
				&& matches(details , beleg.getDetails())
				&& matches(mandat , beleg.getMandat());
	}

	private boolean matches(String pattern, String text) {
		return text  == null || text.isEmpty() || text.contains(pattern);
	}
}
