package loc.balsen.kontospring.upload;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.util.Date;
import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import loc.balsen.kontospring.data.Beleg;
import loc.balsen.kontospring.repositories.BelegRepository;

@RunWith(SpringJUnit4ClassRunner.class)
@Configuration
@EnableAutoConfiguration
@EnableJpaRepositories(basePackages = "loc.balsen.kontospring.repositories")
@EntityScan("loc.balsen.kontospring.data")
@ComponentScan
@PropertySource("database-test.properties")
public class ImportbaseTest {
	
	@Autowired
	private BelegRepository belegRepository;
	
	@Autowired
	private ImportTest importer;
		
	@Test
	public void testSave() {

		List<Beleg> result = null;
		
		Date now = new Date();
		Date later = new Date(now.getTime()+5);

		Beleg beleg1 = createBeleg ("ich", "du", now, 100);
		Beleg beleg2 = createBeleg ("ich", "du", now, 100);

		
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

	private Beleg createBeleg(String absender, String empfaenger, Date beleg, int wert) {
		Beleg res  =  new Beleg();
		res.setAbsender(absender);
		res.setEmpfaenger(empfaenger);
		res.setWert(wert);
		res.setBeleg(beleg);
		return res;
	}

}
