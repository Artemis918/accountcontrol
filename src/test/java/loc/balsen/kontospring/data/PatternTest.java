package loc.balsen.kontospring.data;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PatternTest {

	@BeforeEach
	void setUp() throws Exception {
	}

	@AfterEach
	void tearDown() throws Exception {
	}

	static String examplejson = " {"
			+ "\"sender\": \"gulli0\","
			+ "\"receiver\": \"rec01\","
			+ "\"referenceID\": \"ref01\","
			+ "\"senderID\": \"send01\","
			+ "\"details\": \"det01\","
			+ "\"mandate\": \"mand01\""
			+ "}";

	@Test
	void testJsonString() {
		Pattern pattern = new Pattern(examplejson);
		
		assertEquals("gulli0",pattern.getSender());
		assertEquals("rec01",pattern.getReceiver());
		assertEquals("ref01",pattern.getReferenceID());
		assertEquals("send01",pattern.getSenderID());
		assertEquals("det01",pattern.getDetails());
		assertEquals("mand01",pattern.getMandate());
	}
	
	@Test 
	void testMatchesAll() {
		Pattern pattern = new Pattern(examplejson);
		
		AccountRecord rec = new AccountRecord();
		rec.setSender("gulli0123");
		rec.setReceiver("grtrec01");
		rec.setReference("ref01");
		rec.setSubmitter("abcsend01ert");
		rec.setDetails("det01");
		rec.setMandate("mand01");
		assertTrue(pattern.matches(rec));
	}

	@Test 
	void testMatchesEdges() {
		Pattern pattern = new Pattern(examplejson);
		AccountRecord rec = new AccountRecord();

		rec.setSender(null);
		rec.setReceiver("grtrec01");
		rec.setReference("ref01");
		rec.setSubmitter("abcsend01ert");
		rec.setDetails("det01");
		rec.setMandate("mand01");
		assertFalse(pattern.matches(rec));
		
		rec.setSender("");
		assertFalse(pattern.matches(rec));
		
		pattern.setSender("");
		assertTrue(pattern.matches(rec));

		pattern.setSender(null);
		assertTrue(pattern.matches(rec));
		
		pattern.setReceiver("something");
		assertFalse(pattern.matches(rec));

		pattern.setReceiver("");
		assertTrue(pattern.matches(rec));
	}
}
