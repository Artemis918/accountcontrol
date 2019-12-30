package loc.balsen.kontospring.testutil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import loc.balsen.kontospring.Application;
import loc.balsen.kontospring.data.SubCategory;
import loc.balsen.kontospring.data.Category;
import loc.balsen.kontospring.repositories.BuchungsBelegRepository;
import loc.balsen.kontospring.repositories.CategoryRepository;
import loc.balsen.kontospring.repositories.SubCategoryRepository;
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
	protected CategoryRepository kontogruppeRepository;

	@Autowired
	protected SubCategoryRepository kontoRepository;

	@Autowired
	protected ZuordnungRepository zuordnungRepository;

	@Autowired
	protected BuchungsBelegRepository buchungsbelegRepository;

	protected SubCategory subCategory1;
	protected SubCategory subCategory2;
	protected SubCategory subCategory3;
	protected SubCategory subCategory4;
	protected SubCategory subCategory5;

	protected Category category1;
	protected Category category2;
	protected Category kontogruppe3;

	public void clearRepos() {
		zuordnungRepository.deleteAll();
		buchungsbelegRepository.deleteAll();
		planRepository.deleteAll();
		templateRepository.deleteAll();
	}
	
	protected void createKontoData() {

		if (kontogruppeRepository.findById(1).isPresent()) {
			category1 = kontogruppeRepository.findById(1).get();
			category2 = kontogruppeRepository.findById(2).get();
			kontogruppe3 = kontogruppeRepository.findById(3).get();

			subCategory1 = kontoRepository.findById(1).get();
			subCategory2 = kontoRepository.findById(2).get();
			subCategory3 = kontoRepository.findById(3).get();
			subCategory4 = kontoRepository.findById(4).get();
			subCategory5 = kontoRepository.findById(5).get();
		} else {

			category1 = new Category();
			category2 = new Category();
			kontogruppe3 = new Category();
			category1.setShortdescription("KontoG1");
			category2.setShortdescription("KontoG2");
			kontogruppe3.setShortdescription("KontoG3");
			kontogruppeRepository.save(category1);
			kontogruppeRepository.save(category2);
			kontogruppeRepository.save(kontogruppe3);

			subCategory1 = new SubCategory();
			subCategory2 = new SubCategory();
			subCategory3 = new SubCategory();
			subCategory4 = new SubCategory();
			subCategory5 = new SubCategory();

			subCategory1.setShortdescription("k1shortDesc");
			subCategory2.setShortdescription("k2shortDesc");
			subCategory3.setShortdescription("k3shortDesc");
			subCategory4.setShortdescription("k4shortDesc");
			subCategory5.setShortdescription("k5shortDesc");

			subCategory1.setDescription("k1LangDesc");
			subCategory1.setCategory(category1);
			subCategory2.setCategory(category1);
			subCategory3.setCategory(category1);
			subCategory4.setCategory(category1);
			subCategory5.setCategory(category2);

			kontoRepository.save(subCategory1);
			kontoRepository.save(subCategory2);
			kontoRepository.save(subCategory3);
			kontoRepository.save(subCategory4);
			kontoRepository.save(subCategory5);
		}
	}
}
