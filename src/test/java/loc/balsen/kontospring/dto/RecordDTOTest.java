package loc.balsen.kontospring.dto;

import static org.junit.Assert.assertEquals;

import java.time.LocalDate;

import org.junit.Test;

import loc.balsen.kontospring.data.AccountRecord;

public class RecordDTOTest {

	@Test
	public void test() {
		AccountRecord record =  new AccountRecord();
		record.setValue(102056);
		record.setExecuted(LocalDate.now());
		record.setSender("sender");
		record.setReceiver("receiver");
		record.setDetails("Reference NOTPROVIDED");
		
		RecordDTO dto = new RecordDTO(record);
		
		assertEquals("sender", dto.getPartner());
		assertEquals("Reference NOTPROVIDED",dto.getDetails());
	}

}
