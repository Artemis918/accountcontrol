package loc.balsen.kontospring.data;

import static org.junit.Assert.*;

import java.time.LocalDate;

import org.junit.Test;

public class TemplateTest {

	@Test
	public void testIncreaseDate() {
		Template template =  new Template();
		
		LocalDate date = LocalDate.of(1998,11,30);
		template.setAnzahlRythmus(4);
		template.setRythmus(Template.Rythmus.WEEK);
		LocalDate result = template.increaseDate(date);
		assertEquals(LocalDate.of(1998,12,28),result);
		
		template.setAnzahlRythmus(34);
		template.setRythmus(Template.Rythmus.DAY);
		result = template.increaseDate(result);
		assertEquals(LocalDate.of(1999,1,31),result);
		
		template.setAnzahlRythmus(1);
		template.setRythmus(Template.Rythmus.MONTH);
		result = template.increaseDate(result);
		assertEquals(LocalDate.of(1999,2,28),result);
		
		template.setAnzahlRythmus(1);
		template.setRythmus(Template.Rythmus.MONTH);
		result = template.increaseDate(result);
		assertEquals(LocalDate.of(1999,3,28),result);

		template.setAnzahlRythmus(1);
		template.setRythmus(Template.Rythmus.YEAR);
		result = template.increaseDate(result);
		assertEquals(LocalDate.of(2000,3,28),result);
		
	}

}
