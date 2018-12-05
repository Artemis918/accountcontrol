package loc.balsen.kontospring.data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;

import lombok.Data;

@Data
@Entity
public class Konto {

	public static final int LEN_DESCRIPTION = 512;
	public static final int LEN_SHORTDESCRIPTIION = 80;
	
	public static final int EXTERN = 0;
	public static final int INTERN = 1;

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_konto_name")
	@SequenceGenerator(name = "seq_konto_name", sequenceName = "seq_konto", allocationSize = 1)
	private Long id;
	private String shortdescription;
	private String description;
	private int art; 
	
	@ManyToOne
	@JoinColumn(name = "id_gruppe")
	private Kontogruppe kontoGruppe;
}
