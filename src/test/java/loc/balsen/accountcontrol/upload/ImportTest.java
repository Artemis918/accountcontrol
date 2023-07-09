package loc.balsen.accountcontrol.upload;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.text.ParseException;
import org.springframework.stereotype.Component;

@Component
public class ImportTest extends Importbase {

  @Override
  boolean ImportFile(String filename, BufferedInputStream data) throws ParseException, IOException {
    return false;
  }

}
