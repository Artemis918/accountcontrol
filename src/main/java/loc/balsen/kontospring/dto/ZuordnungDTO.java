package loc.balsen.kontospring.dto;

import loc.balsen.kontospring.data.Plan;
import loc.balsen.kontospring.data.Zuordnung;
import lombok.Data;

@Data
public class ZuordnungDTO {

	int id;
	String detail;
	int sollwert;
	int istwert;
	int committed;

	public ZuordnungDTO(Zuordnung z) {
		id =  z.getId();
		detail = z.getShortdescription();
		istwert = z.getWert();
		
		Plan plan =  z.getPlan();
		if (plan != null) {
			sollwert = plan.getWert();
		}
	}
}
