package loc.balsen.kontospring.controller;

import lombok.Getter;

@Getter
public class StandardResult {
	boolean error;
	String message;

	public StandardResult(boolean error, String message) {
		this.error = error;
		this.message=message;
	}
	
}
