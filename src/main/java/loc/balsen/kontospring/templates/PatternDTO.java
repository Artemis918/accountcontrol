package loc.balsen.kontospring.templates;

import lombok.Data;

@Data
public class PatternDTO {

	
	private String sender;
	private String receiver;
	private String referenceID;
	private String details;
	private String mandat;

	public PatternDTO() {
	}
	
}
