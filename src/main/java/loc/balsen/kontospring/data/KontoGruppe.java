package loc.balsen.kontospring.data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;

import lombok.Data;

@Data
@Entity
public class KontoGruppe {

	public static int LEN_DESCRIPTION = 512;
	public static int LEN_SHORTDESCRIPTIION = 80;

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_kontogruppe_name")
	@SequenceGenerator(name = "seq_kontogruppe_name", sequenceName = "seq_kontogruppe", allocationSize = 1)
	private int id;
	private String shortdescription;
	private String description;

	public String getUltraShortdescription() {
		return shortdescription.substring(0,3);
	}
}
