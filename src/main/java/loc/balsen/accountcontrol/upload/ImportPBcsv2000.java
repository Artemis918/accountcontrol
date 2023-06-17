package loc.balsen.accountcontrol.upload;

import org.springframework.stereotype.Component;

@Component
public class ImportPBcsv2000 extends ImportPB {

  ImportPBcsv2000() {
    super(".csv", "CP1252", ';', 9);
  }
}
