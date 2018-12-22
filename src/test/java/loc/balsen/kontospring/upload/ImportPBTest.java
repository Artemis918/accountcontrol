package loc.balsen.kontospring.upload;


import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import loc.balsen.kontospring.data.BuchungsBeleg;
import loc.balsen.kontospring.repositories.BuchungsBelegRepository;

public class ImportPBTest {

	static String HEADER = "\n\n";
	
	static String TESTDATA = "\"30.08.2018\";\"31.08.2018\";\""
			+ "Lastschrift\";"
			+ "\"Referenz Zahlbeleg 355807144738 "
			+ "Mandat DE00020110020000000000000000 6587039 "
			+ "Einreicher-ID DE93ZZZ00000078611 "
			+ "Festnetz Vertragskonto 4883341542 RG 5172931128/22.08.2018 \";"
			+ "\"Marion Balsen Dieter Balsen\";"
			+ "\"Telekom Deutschland GmbH\";"
			+ "\"-42,80 €\";"
			+ "\"10.657,00 €\"";

	@Mock
	BuchungsBelegRepository belegRepository;

	@InjectMocks
	ImportPB importer = new ImportPB(".csv", "UTF-8", ';', 2);

	@Before
	public void setup() {
		MockitoAnnotations.initMocks(this);
	}
	
	@Test
	public void testImport() throws ParseException, IOException {

		LocalDate start = LocalDate.now();				
		
		ByteArrayInputStream input =  new ByteArrayInputStream((HEADER + TESTDATA).getBytes("UTF-8"));		
		importer.ImportFile("test.csv", input);
		
		ArgumentCaptor<BuchungsBeleg> argcap =  ArgumentCaptor.forClass(BuchungsBeleg.class);
		verify(belegRepository).save(argcap.capture());
		BuchungsBeleg beleg = argcap.getValue();
		
		LocalDate eingang = beleg.getEingang();
		assertTrue(!eingang.isBefore(start) && !eingang.isAfter(LocalDate.now()));
		assertEquals(LocalDate.parse("2018-08-30"),beleg.getBeleg());
		assertEquals(LocalDate.parse("2018-08-31"),beleg.getWertstellung());
		assertEquals(BuchungsBeleg.Art.LASTSCHRIFT,beleg.getArt());
		assertEquals("Marion Balsen Dieter Balsen",beleg.getAbsender());
		assertEquals("Telekom Deutschland GmbH",beleg.getEmpfaenger());
		assertEquals(-4280,beleg.getWert());
		assertEquals("Festnetz Vertragskonto 4883341542 RG 5172931128/22.08.2018",beleg.getDetails());
		assertEquals("Zahlbeleg 355807144738", beleg.getReferenz());
		assertEquals("DE00020110020000000000000000 6587039", beleg.getMandat());
		assertEquals("DE93ZZZ00000078611", beleg.getEinreicherId());
	}
	
	@Test
	public void testParseError() throws IOException, ParseException {
		ByteArrayInputStream input =  new ByteArrayInputStream((HEADER + TESTDATA).substring(0, 148).getBytes("UTF-8"));		
		try {
			importer.ImportFile("test.csv", input);
		} catch (RuntimeException e) {
			return;
		}
		fail("no parse exception");
	}
	
	@Test
	public void testInsertTwice() throws ParseException, IOException {

		List<BuchungsBeleg> belegList = new ArrayList<>();
		belegList.add(new BuchungsBeleg());
		when(belegRepository.findByWertAndBelegAndAbsenderAndEmpfaenger(eq(-4280), any(LocalDate.class), any(String.class), any(String.class))).thenReturn(belegList );

		String testData2 = new String(TESTDATA).replace("-42,80","-42,90");
		ByteArrayInputStream input =  new ByteArrayInputStream((HEADER + testData2 + "\n" + TESTDATA + "\n" + testData2).getBytes("UTF-8"));		
		importer.ImportFile("test.csv", input);
		
		ArgumentCaptor<BuchungsBeleg> argcap =  ArgumentCaptor.forClass(BuchungsBeleg.class);
		verify(belegRepository,times(2)).save(argcap.capture());
		List<BuchungsBeleg> res = argcap.getAllValues();
		
		assertEquals(-4290, res.get(0).getWert());
		assertEquals(-4290, res.get(1).getWert());
	}

}