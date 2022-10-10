package loc.balsen.kontospring.dto;

import java.util.List;

public class StatsDTO {
  List<StatsMonthDTO> data;
  int min;
  int max;

  public StatsDTO(List<StatsMonthDTO> d, int min, int max) {
    data = d;
    this.min = min;
    this.max = max;
  }

  public List<StatsMonthDTO> getData() {
    return data;
  }

  public int getMin() {
    return min;
  }

  public int getMax() {
    return max;
  }

}
