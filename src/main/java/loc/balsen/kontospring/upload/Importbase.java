/**
 * 
 */
package loc.balsen.kontospring.upload;

import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import loc.balsen.kontospring.data.AccountRecord;
import loc.balsen.kontospring.repositories.AccountRecordRepository;

/**
 * @author balsen
 *
 */

public abstract class Importbase {

	@Autowired
	protected AccountRecordRepository accountRecordRepository;

	abstract boolean ImportFile(String filename, InputStream data) throws ParseException, IOException;

	public Importbase() {
	}

	public boolean save(AccountRecord record) {
		if (record == null ||exists(record)) 
			return false;

		accountRecordRepository.save(record);
		return true;
	}

	private boolean exists(AccountRecord record) {
		List<AccountRecord> same = accountRecordRepository.findByWertAndCreationAndAbsenderAndEmpfaenger(record.getWert(), record.getCreation(),
				record.getAbsender(), record.getEmpfaenger());

		return !same.isEmpty();
	}
}
