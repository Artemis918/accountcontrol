package loc.balsen.accountcontrol.data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;

@Entity
public class Category {

  public static int LEN_DESCRIPTION = 512;
  public static int LEN_SHORTDESCRIPTIION = 80;

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_category_name")
  @SequenceGenerator(name = "seq_category_name", sequenceName = "seq_category", allocationSize = 1)
  private int id;
  private String shortDescription;
  private String description;

  public Category() {}

  public Category(int id, String shortdescription, String description) {
    this.id = id;
    this.shortDescription = shortdescription;
    this.description = description;
  }

  public void setDescription(String shortDescription, String description) {
    this.description = description;
    this.shortDescription = shortDescription;
  }

  public String getUltraShortdescription() {
    return shortDescription.substring(0, 3);
  }

  public int getId() {
    return id;
  }

  public String getShortDescription() {
    return shortDescription;
  }

  public String getDescription() {
    return description;
  }
}
