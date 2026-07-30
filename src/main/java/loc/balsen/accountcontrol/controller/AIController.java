package loc.balsen.accountcontrol.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;

import loc.balsen.accountcontrol.dataservice.AIService;

@RestController
@RequestMapping("/ai")
public class AIController {

  @Autowired
  private AIService aiService;

  @PostMapping("/train-chunks")
  public ResponseEntity<Object> trainChunks(@RequestParam(name = "chunkSize", required = false) Integer chunkSize) {
    int size = chunkSize == null ? 200 : chunkSize.intValue();
    AIService.TrainingResult res = aiService.trainModelWithChunks(size);
    return ResponseEntity.ok(res);
  }

}
