package loc.balsen.kontospring.upload;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import loc.balsen.kontospring.Application;
import loc.balsen.kontospring.data.BuchungsBeleg;
import loc.balsen.kontospring.repositories.BuchungsBelegRepository;

@RunWith(SpringJUnit4ClassRunner.class)
@AutoConfigureMockMvc
@ContextConfiguration(classes = Application.class)
@TestPropertySource("classpath:/h2database.properties")
@WebAppConfiguration
public class ImportbaseTest {
	
	@Autowired
	private BuchungsBelegRepository belegRepository;
	
	@Autowired
	private ImportTest importer;
		
	@Test
	public void testSave() {

		List<BuchungsBeleg> result = null;
		
		LocalDate now = LocalDate.now();
		LocalDate later = now.plusDays(5);

		BuchungsBeleg beleg1 = createBeleg ("ich", "du", now, 100);
		BuchungsBeleg beleg2 = createBeleg ("ich", "du", now, 100);

		
		assertTrue(importer.save(beleg1));
		result = belegRepository.findAll();
		assertEquals(1,result.size());
		assertNotNull( result.get(0).getId());
		assertNotNull( beleg1.getId());
		
		assertFalse(importer.save(null));
		assertFalse(importer.save(beleg2));
		assertEquals(1,result.size());
		
		assertTrue(importer.save(createBeleg ("ich", "du", now, 101)));
		assertTrue(importer.save(createBeleg ("ich", "du", later, 100)));
		assertTrue(importer.save(createBeleg ("er", "du", now, 100)));
		assertTrue(importer.save(createBeleg ("ich", "er", now, 100)));
		result = belegRepository.findAll();
		assertEquals(5,result.size());
		
	}

	private BuchungsBeleg createBeleg(String absender, String empfaenger, LocalDate beleg, int wert) {
		BuchungsBeleg res  =  new BuchungsBeleg();
		res.setAbsender(absender);
		res.setEmpfaenger(empfaenger);
		res.setWert(wert);
		res.setBeleg(beleg);
		return res;
	}

}
