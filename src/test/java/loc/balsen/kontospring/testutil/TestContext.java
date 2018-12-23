package loc.balsen.kontospring.testutil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import loc.balsen.kontospring.Application;
import loc.balsen.kontospring.repositories.BuchungsBelegRepository;
import loc.balsen.kontospring.repositories.KontoGruppeRepository;
import loc.balsen.kontospring.repositories.KontoRepository;
import loc.balsen.kontospring.repositories.PlanRepository;
import loc.balsen.kontospring.repositories.TemplateRepository;
import loc.balsen.kontospring.repositories.ZuordnungRepository;

@SpringBootTest(classes = Application.class)
@TestPropertySource("classpath:/h2database.properties")
public class TestContext {

	@Autowired
	protected TemplateRepository templateRepository;

	@Autowired
	protected PlanRepository planRepository;

	@Autowired
	protected KontoGruppeRepository kontogruppeRepository;
	
	@Autowired
	protected KontoRepository kontoRepository;
	
	@Autowired
	protected ZuordnungRepository zuordnungRepository;
	
	@Autowired
	protected BuchungsBelegRepository buchungsbelegRepository;
	
}
