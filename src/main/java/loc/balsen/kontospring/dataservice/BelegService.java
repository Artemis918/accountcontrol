package loc.balsen.kontospring.dataservice;

import org.springframework.stereotype.Component;

@Component
public class BelegService {

	
//	TODO delete stuff
//	public List<Buchungsbeleg> getBelege(boolean all) {
//		String sql = "select bb from Buchungsbeleg bb";
//
//		if (!all)
//			sql += " where bb.id not in ( select z.buchungsbeleg from Zuordnung z ) order by bb.beleg";
//
//		List<Buchungsbeleg> result = entityManager.createQuery(sql, Buchungsbeleg.class)
//				.getResultList();
//		return result;
//	}

//	public void delete(Buchungsbeleg bb) {
//		entityManager.remove(bb);
//	}

//	TODO delete stuff
//	/**
//	 * deliver all Buchungsbeleg which are assigned via plans to the given
//	 * template
//	 * 
//	 * @param t
//	 *            origin template
//	 * @return List of Buchungsbelege
//	 */
//	public List<Buchungsbeleg> getBelege(Template t) {
//
//		String statement = "select bb from Buchungsbeleg bb "
//				         + "where id in "
//				         + "  (select z.buchungsbeleg "
//				         + "     from Zuordnung z, Plan p"
//				         + "    where z.plan = p "
//				         + "      and p.template = :id"
//				         + "      and p.plandate >= :start )";
//
//		TypedQuery<Buchungsbeleg> query = entityManager.createQuery(statement,
//				Buchungsbeleg.class);
//		query.setParameter("id", t);
//		query.setParameter("start", t.getGueltigVon());
//		List<Buchungsbeleg> result = query.getResultList();
//		return result;
//	}
}