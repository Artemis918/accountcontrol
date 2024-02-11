package loc.balsen.accountcontrol.data;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;

@Entity
public class SubCategory {

  public static final int LEN_DESCRIPTION = 512;
  public static final int LEN_SHORTDESCRIPTIION = 80;

  public enum Type {
    EXTERN, INTERN
  }

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_subcategory_name")
  @SequenceGenerator(name = "seq_subcategory_name", sequenceName = "seq_subcategory",
      allocationSize = 1)
  private int id;

  @Column(name = "shortdescription")
  private String shortDescription;

  private String description;
  private Type type;
  private Boolean active;
  private Boolean favorite;

  @ManyToOne
  @JoinColumn(name = "category")
  private Category category;

  public SubCategory() {}

  public SubCategory(int id, String shortdescription, String description, Type type, Category cat) {
    this.id = id;
    this.shortDescription = shortdescription;
    this.description = description;
    this.type = type;
    this.category = cat;
    this.active = true;
    this.favorite = false;
  }

  public void setDescription(String shortDescription, String description) {
    this.description = description;
    this.shortDescription = shortDescription;
  }

  public int getId() {
    return id;
  }

  public Category getCategory() {
    return category;
  }

  public String getShortDescription() {
    return shortDescription;
  }

  public String getDescription() {
    return description;
  }

  public Type getType() {
    return type;
  }

  public boolean isActive() {
    return active;
  }

  public void setActive(boolean active) {
    this.active = active;
  }

  public boolean isFavorite() {
    return favorite;
  }

  public void setFavorite(boolean favorite) {
    this.favorite = favorite;
  }
}
