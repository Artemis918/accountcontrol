package loc.balsen.kontospring.data;


import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;


public class TemplateTest {

	@Test
	public void testIncreaseDate() {
		Template template =  new Template();
		
		LocalDate date = LocalDate.of(1998,11,30);
		template.setRepeatCount(4);
		template.setRepeatUnit(Template.TimeUnit.WEEK);
		LocalDate result = template.increaseDate(date);
		assertEquals(LocalDate.of(1998,12,28),result);
		
		template.setRepeatCount(34);
		template.setRepeatUnit(Template.TimeUnit.DAY);
		result = template.increaseDate(result);
		assertEquals(LocalDate.of(1999,1,31),result);
		
		template.setRepeatCount(1);
		template.setRepeatUnit(Template.TimeUnit.MONTH);
		result = template.increaseDate(result);
		assertEquals(LocalDate.of(1999,2,28),result);
		
		template.setRepeatCount(1);
		template.setRepeatUnit(Template.TimeUnit.MONTH);
		result = template.increaseDate(result);
		assertEquals(LocalDate.of(1999,3,28),result);

		template.setRepeatCount(1);
		template.setRepeatUnit(Template.TimeUnit.YEAR);
		result = template.increaseDate(result);
		assertEquals(LocalDate.of(2000,3,28),result);
		
	}

}
