package loc.balsen.kontospring.upload;


import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.eq;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.List;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;

import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import loc.balsen.kontospring.data.Beleg;
import loc.balsen.kontospring.repositories.BelegRepository;

public class ImportPBTest {

	static String HEADER = "\n\n";
	
	static String TESTDATA = "\"30.08.2018\";\"31.08.2018\";\"Gutschrift\";"
			+ "\"Referenz 982432516641 \";\"AGNUS BALSEN DOROTHEA BALSE\";"
			+ "\"Marion Balsen Dieter Balsen\";\"1.500,00 €\";\"12.157,00 €\"";

	@Mock
	BelegRepository belegRepository;

	@InjectMocks
	ImportPB importer = new ImportPB(".csv", "UTF-8", ';', 2);

	@Before
	public void setup() {
		MockitoAnnotations.initMocks(this);
	}
	
	@Test
	public void testImport() throws ParseException, IOException {

		Date start = Calendar.getInstance().getTime();				
		
		ByteArrayInputStream input =  new ByteArrayInputStream((HEADER + TESTDATA).getBytes("UTF-8"));		
		importer.ImportFile("test.csv", input);
		
		ArgumentCaptor<Beleg> argcap =  ArgumentCaptor.forClass(Beleg.class);
		verify(belegRepository).save(argcap.capture());
		Beleg beleg = argcap.getValue();
		
		SimpleDateFormat formatter = new SimpleDateFormat("dd.MM.yyyy");
		
		Date eingang = beleg.getEingang();
		assertTrue(!eingang.before(start) && !eingang.after(Calendar.getInstance().getTime()));
		assertEquals(formatter.parse("30.08.2018"),beleg.getBeleg());
		assertEquals(formatter.parse("31.08.2018"),beleg.getWertstellung());
		assertEquals(Beleg.Art.GUTSCHRIFT,beleg.getArt());
		assertEquals("AGNUS BALSEN DOROTHEA BALSE",beleg.getAbsender());
		assertEquals("Marion Balsen Dieter Balsen",beleg.getEmpfaenger());
		assertEquals(150000,beleg.getWert());
		assertEquals("Referenz 982432516641 ",beleg.getDetails());
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

		List<Beleg> belegList = new ArrayList<>();
		belegList.add(new Beleg());
		when(belegRepository.findByWertAndBelegAndAbsenderAndEmpfaenger(eq(150000), any(Date.class), any(String.class), any(String.class))).thenReturn(belegList );

		String testData2 = new String(TESTDATA).replace("1.500,00","1.400,00");
		ByteArrayInputStream input =  new ByteArrayInputStream((HEADER + testData2 + "\n" + TESTDATA + "\n" + testData2).getBytes("UTF-8"));		
		importer.ImportFile("test.csv", input);
		
		ArgumentCaptor<Beleg> argcap =  ArgumentCaptor.forClass(Beleg.class);
		verify(belegRepository,times(2)).save(argcap.capture());
		List<Beleg> res = argcap.getAllValues();
		
		assertEquals(140000, res.get(0).getWert());
		assertEquals(140000, res.get(1).getWert());
	}

}