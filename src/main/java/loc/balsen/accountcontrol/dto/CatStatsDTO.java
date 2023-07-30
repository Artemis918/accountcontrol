package loc.balsen.accountcontrol.dto;

import java.util.List;

public class CatStatsDTO {

  private List<Integer> estimated;
  private List<Integer> real;
  private int catID;
  private String catName;

  public CatStatsDTO() {}

  public CatStatsDTO(List<Integer> estimated, List<Integer> real, int catID, String catName) {
    this.estimated = estimated;
    this.real = real;
    this.catID = catID;
    this.catName = catName;
  }

  public List<Integer> getReal() {
    return real;
  }

  public List<Integer> getEstimated() {
    return estimated;
  }

  public int getCatID() {
    return catID;
  }

  public String getCatName() {
    return catName;
  }

}
