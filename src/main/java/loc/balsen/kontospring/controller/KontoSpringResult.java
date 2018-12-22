package loc.balsen.kontospring.controller;

import lombok.Getter;

@Getter
public class KontoSpringResult {
	boolean error;
	String message;

	public KontoSpringResult(boolean error, String message) {
		this.error = error;
		this.message=message;
	}
	
}
