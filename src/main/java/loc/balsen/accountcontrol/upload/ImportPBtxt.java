package loc.balsen.accountcontrol.upload;

import org.springframework.stereotype.Component;

@Component
public class ImportPBtxt extends ImportPB {

  ImportPBtxt() {
    super(".txt", "ISO-8859-1", '\t', 11);
  }
}
