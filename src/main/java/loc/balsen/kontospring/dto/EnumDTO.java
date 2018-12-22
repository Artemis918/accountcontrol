package loc.balsen.kontospring.dto;

import lombok.Data;

@Data
public class EnumDTO {

	public EnumDTO(String t, int val ) {
		text=t;
		value=val;
	}

	private String text;
	private int value;
}
