package loc.balsen.kontospring.belege;

import static org.junit.Assert.assertEquals;

import java.time.LocalDate;

import org.junit.Test;

import loc.balsen.kontospring.data.BuchungsBeleg;
import loc.balsen.kontospring.dto.BelegSmallDTO;

public class BelegDTOTest {

	@Test
	public void test() {
		BuchungsBeleg beleg =  new BuchungsBeleg();
		beleg.setWert(102056);
		beleg.setWertstellung(LocalDate.now());
		beleg.setAbsender("absender");
		beleg.setEmpfaenger("empfänger");
		beleg.setDetails("Referenz NOTPROVIDED");
		
		BelegSmallDTO dto = new BelegSmallDTO(beleg);
		
		assertEquals("absender", dto.getPartner());
		assertEquals("Referenz NOTPROVIDED",dto.getDetails());
	}

}
