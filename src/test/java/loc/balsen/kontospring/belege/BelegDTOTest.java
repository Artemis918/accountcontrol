package loc.balsen.kontospring.belege;

import static org.junit.Assert.*;

import java.util.Date;

import org.junit.Test;

import loc.balsen.kontospring.data.Beleg;

public class BelegDTOTest {

	@Test
	public void test() {
		Beleg beleg =  new Beleg();
		beleg.setWert(102056);
		beleg.setWertstellung(new Date());
		beleg.setAbsender("absender");
		beleg.setEmpfaenger("empfänger");
		beleg.setDetails("Referenz NOTPROVIDED");
		
		BelegSmallDTO dto = new BelegSmallDTO(beleg);
		
		assertEquals("absender", dto.getPartner());
		assertEquals("Referenz NOTPROVIDED",dto.getDetails());
	}

}
