package loc.balsen.accountcontrol.upload;

import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;

@Component
public class FileImport {

  ArrayList<Importbase> importer;

  @Autowired
  ImportPBtxt importPBtxt;

  @Autowired
  ImportPBcsv2000 importPBcsv;

  @Autowired
  ImportXML importXML;

  @Autowired
  ImportPBcsv2022 importPBcsv2022;

  public FileImport() {
    importer = new ArrayList<Importbase>();
  }

  @PostConstruct
  private void initImporter() {
    importer.add(importPBtxt);
    importer.add(importPBcsv);
    importer.add(importXML);
    importer.add(importPBcsv2022);
  }

  public void importFile(String fileName, InputStream data) throws ParseException, IOException {
    for (Importbase importbase : importer) {
      if (importbase.ImportFile(fileName, data)) {
        return;
      }
    }
    throw new ParseException("no module found to import file", 0);
  }


}
