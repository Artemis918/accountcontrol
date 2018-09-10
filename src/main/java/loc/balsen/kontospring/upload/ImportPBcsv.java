package loc.balsen.kontospring.upload;

import org.springframework.stereotype.Component;

@Component
public class ImportPBcsv extends ImportPB {

	ImportPBcsv() {
		super(".csv","CP1252", ';',9);
	}
}
