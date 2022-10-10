package loc.balsen.kontospring.data;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PatternTest {

  @BeforeEach
  void setUp() throws Exception {}

  @AfterEach
  void tearDown() throws Exception {}

  static String examplejson = " {" + "\"sender\": \"gulli0\"," + "\"receiver\": \"rec01\","
      + "\"referenceID\": \"ref01\"," + "\"senderID\": \"send01\"," + "\"details\": \"det01\","
      + "\"mandate\": \"mand01\"" + "}";

  @Test
  void testJsonString() {
    Pattern pattern = new Pattern(examplejson);

    assertEquals("gulli0", pattern.getSender());
    assertEquals("rec01", pattern.getReceiver());
    assertEquals("ref01", pattern.getReferenceID());
    assertEquals("send01", pattern.getSenderID());
    assertEquals("det01", pattern.getDetails());
    assertEquals("mand01", pattern.getMandate());
  }

  @Test
  void testMatchesAll() {
    Pattern pattern = new Pattern(examplejson);
    List<String> details = new ArrayList<>();
    details.add("det01");

    AccountRecord rec = new AccountRecord(0, null, null, null, null, "gulli0123", "grtrec01", 0,
        details, "abcsend01ert", "mand01", "ref01");
    assertTrue(pattern.matches(rec));
  }

  @Test
  void testMatchesEdges() {
    Pattern pattern1 = new Pattern("gulli01", "rec01", "ref01", "send01", "det01", "mand01");
    Pattern pattern2 = new Pattern("", "rec01", "ref01", "send01", "det01", "mand01");
    Pattern pattern3 = new Pattern(null, "rec01", "ref01", "send01", "det01", "mand01");
    Pattern pattern4 = new Pattern(null, "something", "ref01", "send01", "det01", "mand01");
    Pattern pattern5 = new Pattern(null, "", "ref01", "send01", "det01", "mand01");
    List<String> details = new ArrayList<>();
    details.add("det01");

    AccountRecord rec1 = new AccountRecord(0, null, null, null, null, null, "grtrec01", 0, details,
        "send01", "mand01", "ref01");
    AccountRecord rec2 = new AccountRecord(0, null, null, null, null, "", "grtrec01", 0, details,
        "send01", "mand01", "ref01");

    assertFalse(pattern1.matches(rec1));

    assertFalse(pattern1.matches(rec2));

    assertTrue(pattern2.matches(rec2));

    assertTrue(pattern3.matches(rec2));

    assertFalse(pattern4.matches(rec2));

    assertTrue(pattern5.matches(rec2));
  }
}
