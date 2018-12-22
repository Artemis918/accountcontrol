/**
 * 
 */
package loc.balsen.kontospring.upload;

import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import loc.balsen.kontospring.data.BuchungsBeleg;
import loc.balsen.kontospring.repositories.BuchungsBelegRepository;

/**
 * @author balsen
 *
 */

public abstract class Importbase {

	@Autowired
	protected BuchungsBelegRepository belegRepository;

	abstract boolean ImportFile(String filename, InputStream data) throws ParseException, IOException;

	public Importbase() {
	}

	public boolean save(BuchungsBeleg beleg) {
		if (beleg == null ||exists(beleg)) 
			return false;

		belegRepository.save(beleg);
		return true;
	}

	private boolean exists(BuchungsBeleg beleg) {
		List<BuchungsBeleg> same = belegRepository.findByWertAndBelegAndAbsenderAndEmpfaenger(beleg.getWert(), beleg.getBeleg(),
				beleg.getAbsender(), beleg.getEmpfaenger());

		return !same.isEmpty();
	}
}
