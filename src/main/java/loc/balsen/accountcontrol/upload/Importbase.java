/**
 * 
 */
package loc.balsen.accountcontrol.upload;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.text.ParseException;
import java.util.List;
import org.postgresql.util.PSQLException;
import org.springframework.beans.factory.annotation.Autowired;
import loc.balsen.accountcontrol.data.AccountRecord;
import loc.balsen.accountcontrol.repositories.AccountRecordRepository;

/**
 * @author balsen
 *
 */

public abstract class Importbase {

  @Autowired
  protected AccountRecordRepository accountRecordRepository;

  abstract boolean ImportFile(String filename, BufferedInputStream data)
      throws ParseException, IOException;

  public Importbase() {}

  public boolean save(AccountRecord record) throws PSQLException {

    if (record == null || exists(record))
      return false;

    accountRecordRepository.save(record);
    return true;
  }

  private boolean exists(AccountRecord record) {
    List<AccountRecord> same = accountRecordRepository.findByValueAndCreatedAndSenderAndReceiver(
        record.getValue(), record.getCreated(), record.getSender(), record.getReceiver());

    return !same.isEmpty();
  }
}
