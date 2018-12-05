package loc.balsen.kontospring.templates;

import lombok.Getter;

@Getter
public class TemplateResult {
	boolean error;
	String message;

	public TemplateResult(boolean error, String message) {
		this.error = error;
		this.message=message;
	}
	
}
