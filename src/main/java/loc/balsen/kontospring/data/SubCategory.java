package loc.balsen.kontospring.data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import lombok.Data;

@Data
@Entity
public class SubCategory {

	public static final int LEN_DESCRIPTION = 512;
	public static final int LEN_SHORTDESCRIPTIION = 80;
	
	public static final int EXTERN = 0;
	public static final int INTERN = 1;

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_subcategory_name")
	@SequenceGenerator(name = "seq_subcategory_name", sequenceName = "seq_subcategory", allocationSize = 1)
	private int id;
	private String shortdescription;
	private String description;
	private int type; 
	
	@ManyToOne
	@JoinColumn(name = "category")
	private Category category;
}
