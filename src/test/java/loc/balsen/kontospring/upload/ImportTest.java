package loc.balsen.kontospring.upload;

import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;

import org.springframework.stereotype.Component;

@Component
public class ImportTest extends Importbase{

	@Override
	boolean ImportFile(String filename, InputStream data) throws ParseException, IOException {
		return false;
	}
	
}
