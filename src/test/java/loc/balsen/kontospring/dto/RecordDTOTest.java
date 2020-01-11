package loc.balsen.kontospring.dto;

import static org.junit.Assert.assertEquals;

import java.time.LocalDate;

import org.junit.Test;

import loc.balsen.kontospring.data.AccountRecord;
import loc.balsen.kontospring.dto.RecordDTO;

public class RecordDTOTest {

	@Test
	public void test() {
		AccountRecord record =  new AccountRecord();
		record.setWert(102056);
		record.setWertstellung(LocalDate.now());
		record.setAbsender("absender");
		record.setEmpfaenger("empfänger");
		record.setDetails("Referenz NOTPROVIDED");
		
		RecordDTO dto = new RecordDTO(record);
		
		assertEquals("absender", dto.getPartner());
		assertEquals("Referenz NOTPROVIDED",dto.getDetails());
	}

}
