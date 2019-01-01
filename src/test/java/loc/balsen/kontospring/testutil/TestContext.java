package loc.balsen.kontospring.testutil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import loc.balsen.kontospring.Application;
import loc.balsen.kontospring.data.Konto;
import loc.balsen.kontospring.data.Kontogruppe;
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

	protected Konto konto1;
	protected Konto konto2;
	protected Konto konto3;
	protected Konto konto4;
	protected Konto konto5;

	protected Kontogruppe kontogruppe1;
	protected Kontogruppe kontogruppe2;
	protected Kontogruppe kontogruppe3;

	protected void createKontoData() {

		if (kontogruppeRepository.findById(1).isPresent()) {
			kontogruppe1 = kontogruppeRepository.findById(1).get();
			kontogruppe2 = kontogruppeRepository.findById(2).get();
			kontogruppe3 = kontogruppeRepository.findById(3).get();

			konto1 = kontoRepository.findById(1).get();
			konto2 = kontoRepository.findById(2).get();
			konto3 = kontoRepository.findById(3).get();
			konto4 = kontoRepository.findById(4).get();
			konto5 = kontoRepository.findById(5).get();
		} else {

			kontogruppe1 = new Kontogruppe();
			kontogruppe2 = new Kontogruppe();
			kontogruppe3 = new Kontogruppe();
			kontogruppe1.setShortdescription("KontoG1");
			kontogruppe2.setShortdescription("KontoG2");
			kontogruppe3.setShortdescription("KontoG3");
			kontogruppeRepository.save(kontogruppe1);
			kontogruppeRepository.save(kontogruppe2);
			kontogruppeRepository.save(kontogruppe3);

			konto1 = new Konto();
			konto2 = new Konto();
			konto3 = new Konto();
			konto4 = new Konto();
			konto5 = new Konto();

			konto1.setShortdescription("k1shortDesc");
			konto2.setShortdescription("k2shortDesc");
			konto3.setShortdescription("k3shortDesc");
			konto4.setShortdescription("k4shortDesc");
			konto5.setShortdescription("k5shortDesc");

			konto1.setDescription("k1LangDesc");
			konto1.setKontoGruppe(kontogruppe1);
			konto2.setKontoGruppe(kontogruppe1);
			konto3.setKontoGruppe(kontogruppe1);
			konto4.setKontoGruppe(kontogruppe1);
			konto5.setKontoGruppe(kontogruppe2);

			kontoRepository.save(konto1);
			kontoRepository.save(konto2);
			kontoRepository.save(konto3);
			kontoRepository.save(konto4);
			kontoRepository.save(konto5);
		}
	}
}
