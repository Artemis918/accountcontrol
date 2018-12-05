package loc.balsen.kontospring.dataservice;

import lombok.Data;

@Data
public class EnumDTO {

	EnumDTO(String t, Long val ) {
		text=t;
		value=val;
	}

	EnumDTO(String t, int val ) {
		text=t;
		value=(long)val;
	}

	
	private String text;
	private Long value;
}
