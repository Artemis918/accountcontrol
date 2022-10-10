package loc.balsen.accountcontrol.dto;

import java.time.LocalDate;

public class StatsMonthDTO {
  LocalDate day;
  int value;
  int planvalue;
  int forecast;

  public StatsMonthDTO(LocalDate d, int v, int p, int f) {
    day = d;
    value = v;
    planvalue = p;
    forecast = f;
  }

  public LocalDate getDay() {
    return day;
  }

  public int getValue() {
    return value;
  }

  public int getPlanvalue() {
    return planvalue;
  }

  public int getForecast() {
    return forecast;
  }


}
