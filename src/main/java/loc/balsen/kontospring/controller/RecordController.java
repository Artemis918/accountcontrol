package loc.balsen.kontospring.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import loc.balsen.kontospring.data.AccountRecord;
import loc.balsen.kontospring.dto.MessageID;
import loc.balsen.kontospring.dto.RecordDTO;
import loc.balsen.kontospring.repositories.AccountRecordRepository;

@Controller
@RequestMapping("/record")
@ResponseBody
public class RecordController {
	
	@Autowired
	AccountRecordRepository recordRepository;
	
	@GetMapping("/unassigned")
	List<RecordDTO> findNewRecords() {
		return recordRepository.findUnresolvedRecords()
				.stream()
				.map((record) -> {return new RecordDTO(record);})
				.collect(Collectors.toList());
	}
	
	@GetMapping("/manlist/{year}/{month}")
	List<RecordDTO> findManuelRecords(@PathVariable Integer year, @PathVariable Integer month) {
		LocalDate start = LocalDate.of(year, month, 1);
		LocalDate end = LocalDate.of(year, month, start.lengthOfMonth());
		
		return recordRepository.findByArtAndPeriod(start,end,AccountRecord.Type.MANUELL.ordinal())
				.stream()
				.map((record) -> {return new RecordDTO(record);})
				.collect(Collectors.toList());
	}
	
	@PostMapping("/save")
	MessageID saveRecord(@RequestBody RecordDTO recorddto) {
		if (recorddto.getId() == 0 || recorddto.getType()==AccountRecord.Type.MANUELL) {
			AccountRecord record = recorddto.toRecord();
			record.setType(AccountRecord.Type.MANUELL);
			record.setEingang(LocalDate.now());
			recordRepository.save(record);
			return MessageID.ok;
		}
		else
			return MessageID.invaliddata;
	}
	
	@GetMapping("/id/{id}")
	RecordDTO findTemplate(@PathVariable Integer id) {
		Optional<AccountRecord> record = recordRepository.findById(id);
		if (record.isPresent()) {
			return (new RecordDTO(record.get()));
		}
		else {
			return null;
		}
	}
	
	@GetMapping("/delete/{id}")
	MessageID deleteTemplate(@PathVariable Integer id) {
		Optional<AccountRecord> record = recordRepository.findById(id);
		if (record.isPresent() && record.get().getType() == AccountRecord.Type.MANUELL)
			recordRepository.deleteById(id);
		return MessageID.ok;
	}
}
