package loc.balsen.kontospring.data;

import static org.junit.jupiter.api.Assertions.assertEquals;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;
import loc.balsen.kontospring.data.Template.TimeUnit;

public class TemplateTest {

  @Test
  public void testIncreaseDate() {

    LocalDate date = LocalDate.of(1998, 11, 30);

    Template template = new Template(0, null, null, null, 0, 4, TimeUnit.WEEK, null, 0, 0, null,
        null, null, null, 0);
    date = template.increaseDate(date);
    assertEquals(LocalDate.of(1998, 12, 28), date);

    template = new Template(0, null, null, null, 0, 34, TimeUnit.DAY, null, 0, 0, null, null, null,
        null, 0);
    date = template.increaseDate(date);
    assertEquals(LocalDate.of(1999, 1, 31), date);

    template = new Template(0, null, null, null, 0, 1, TimeUnit.MONTH, null, 0, 0, null, null, null,
        null, 0);
    date = template.increaseDate(date);
    assertEquals(LocalDate.of(1999, 2, 28), date);

    date = template.increaseDate(date);
    assertEquals(LocalDate.of(1999, 3, 28), date);

    template = new Template(0, null, null, null, 0, 1, TimeUnit.YEAR, null, 0, 0, null, null, null,
        null, 0);
    date = template.increaseDate(date);
    assertEquals(LocalDate.of(2000, 3, 28), date);
  }
}
