package loc.balsen.kontospring.upload;

import java.io.IOException;
import java.text.ParseException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;

@Controller
public class UploadController {
	
	@Autowired
	FileImport fileImporter;
	
	@AllArgsConstructor
	@Data
	public class UploadStatus {
		private int status;
		private String message;
	}
	
	@PostMapping("/upload")
	@ResponseBody
    public UploadStatus handleFileUpload(@RequestParam("file") MultipartFile file) {

		UploadStatus res = new UploadStatus(1,file.getOriginalFilename() + " successfully uploaded !");
		
		try {
			fileImporter.importFile(file.getOriginalFilename(),file.getInputStream());
		} catch (IOException e) {
			res.setStatus(1);
			res.setMessage("!!! failed to upload " + file.getOriginalFilename() +": "+ e.getMessage() + " !!!"); 
		} catch (ParseException e) {
			res.setMessage("!!! failed to parse " + file.getOriginalFilename() +": "+ e.getMessage() + " !!!"); 
			res.setStatus(0);
		}
		return res;
    }
	
}
