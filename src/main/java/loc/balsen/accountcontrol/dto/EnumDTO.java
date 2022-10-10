package loc.balsen.kontospring.dto;

public class EnumDTO {

  private String text;
  private int value;

  public EnumDTO(String t, int val) {
    text = t;
    value = val;
  }

  public String getText() {
    return text;
  }

  public int getValue() {
    return value;
  }

}
