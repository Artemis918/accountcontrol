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
	
	

}
