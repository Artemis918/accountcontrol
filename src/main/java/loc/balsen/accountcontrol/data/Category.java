package loc.balsen.accountcontrol.data;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;

@Entity
public class Category {

  public static int LEN_DESCRIPTION = 512;
  public static int LEN_SHORTDESCRIPTIION = 80;

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_category_name")
  @SequenceGenerator(name = "seq_category_name", sequenceName = "seq_category", allocationSize = 1)
  private int id;

  @Column(name = "shortdescription")
  private String shortDescription;

  private String description;
  private boolean active;

  public Category() {}

  public Category(int id, String shortdescription, String description) {
    this.id = id;
    this.shortDescription = shortdescription;
    this.description = description;
    this.active = true;
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


  public boolean isActive() {
    return active;
  }

  public void setActive(boolean active) {
    this.active = active;
  }
}
