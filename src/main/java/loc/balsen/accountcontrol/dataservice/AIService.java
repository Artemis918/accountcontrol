package loc.balsen.accountcontrol.dataservice;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.http.HttpMethod;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import jakarta.annotation.PostConstruct;
import loc.balsen.accountcontrol.data.AccountRecord;
import loc.balsen.accountcontrol.data.Assignment;
import loc.balsen.accountcontrol.dto.RecordDTO;
import loc.balsen.accountcontrol.repositories.AssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import java.time.LocalDate;
import java.util.Map;
import java.util.HashMap;
import java.util.Arrays;


@Component
public class AIService {

  final private String HEALTH_ENDPOINT = "/health";
  final private String PREDICT_ENDPOINT = "/predict";


  @Value("${ai.service.url}")
  private String aiServiceUrl;

  private boolean aiAvailable;
  private final RestTemplate restTemplate = new RestTemplate();

  @Autowired
  private AssignmentRepository assignmentRepository;


  @PostConstruct
  public void initialize() {
    checkAIAvailability();
  }

  @Scheduled(fixedRate = 300000) // Check every 5 minutes
  public void checkAIAvailability() {
    try {
      ResponseEntity<String> response =
          restTemplate.getForEntity(aiServiceUrl + HEALTH_ENDPOINT, String.class);
      aiAvailable = response.getStatusCode() == HttpStatus.OK;
    } catch (RestClientException e) {
      aiAvailable = false;
    }
  }

  public List<Integer> getPredictions(AccountRecord record) {
    if (!aiAvailable) {
      return new ArrayList<>();
    }

    String endpoint = aiServiceUrl + PREDICT_ENDPOINT;

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);

    RecordDTO requestDto = new RecordDTO(record);

    HttpEntity<RecordDTO> request = new HttpEntity<>(requestDto, headers);

    try {
      // Expecting a JSON body like: { "result": [1,2,3] }
      ResponseEntity<PredictionResponse> response =
          restTemplate.postForEntity(endpoint, request, PredictionResponse.class);
      PredictionResponse body = response.getBody();
      if (response.getStatusCode() == HttpStatus.OK && body != null && body.result != null) {
        return body.result;
      }
    } catch (RestClientException e) {
      // ignore and return empty list
    }
    return new ArrayList<>();
  }

  // Small helper class to map the AI service JSON response: { "result": [1,2,3] }
  private static class PredictionResponse {
    public List<Integer> result;
  }

  public boolean isAIAvailable() {
    return aiAvailable;
  }

  public static class TrainingResult {
    public int trainingChunks;
    public int testSize;
    public int correct;
    public double accuracy;
    public String message;
  }

  /**
   * Train model on assignment data chunkwise and test on the last chunk.
   * Chunk size defaults to 200 when calling with 0.
   */
  public TrainingResult trainModelWithChunks(int chunkSize) {
    int usedChunkSize = chunkSize <= 0 ? 200 : chunkSize;

    TrainingResult result = new TrainingResult();

    if (!aiAvailable) {
      result.message = "AI service not available";
      return result;
    }

    List<Assignment> all = assignmentRepository.findAll();
    // filter assignments that have an account record and subcategory label
    List<Map<String, Object>> records = new ArrayList<>();
    for (Assignment a : all) {
      if (a.getAccountrecord() == null || a.getSubCategory() == null)
        continue;
      AccountRecord ar = a.getAccountrecord();
      Map<String, Object> rec = new HashMap<>();
      rec.put("details", ar.getDetails() == null ? "" : ar.getDetails());
      rec.put("value", ar.getValue());
      LocalDate ex = ar.getExecuted();
      if (ex == null)
        rec.put("executed", Arrays.asList(0, 0, 0));
      else
        rec.put("executed", Arrays.asList(ex.getYear(), ex.getMonthValue(), ex.getDayOfMonth()));
      rec.put("mandate", ar.getMandate());
      rec.put("submitter", ar.getSubmitter());
      rec.put("reference", ar.getReference());
      rec.put("sender", ar.getSender());
      rec.put("receiver", ar.getReceiver());
      rec.put("subcategory", a.getSubCategory().getId());
      records.add(rec);
    }

    int total = records.size();
    if (total == 0) {
      result.message = "No labeled records available";
      return result;
    }

    int nChunks = (total + usedChunkSize - 1) / usedChunkSize;
    if (nChunks < 2) {
      result.message = "Not enough data to split into training and test chunks";
      return result;
    }

    try {
      HttpHeaders headers = new HttpHeaders();
      headers.setContentType(MediaType.APPLICATION_JSON);

      // clear any existing chunks on server
      restTemplate.postForEntity(aiServiceUrl + "/clear_chunks", new HttpEntity<>(headers), String.class);

      // upload training chunks (all except last)
      for (int i = 0; i < nChunks - 1; i++) {
        int start = i * usedChunkSize;
        int end = Math.min(start + usedChunkSize, total);
        List<Map<String, Object>> chunk = records.subList(start, end);
        Map<String, Object> payload = new HashMap<>();
        payload.put("records", chunk);
        HttpEntity<Map<String, Object>> req = new HttpEntity<>(payload, headers);
        restTemplate.postForEntity(aiServiceUrl + "/upload_chunk", req, String.class);
      }

      // train model from chunks
      restTemplate.postForEntity(aiServiceUrl + "/train_chunks", new HttpEntity<>(headers), String.class);

      // test with last chunk
      int testStart = (nChunks - 1) * usedChunkSize;
      List<Map<String, Object>> testChunk = records.subList(testStart, total);
      Map<String, Object> testPayload = new HashMap<>();
      testPayload.put("test", testChunk);
      HttpEntity<Map<String, Object>> testReq = new HttpEntity<>(testPayload, headers);
          HttpMethod method = java.util.Objects.requireNonNull(HttpMethod.POST);
          ResponseEntity<Map<String, Object>> testResp = restTemplate.exchange(
            aiServiceUrl + "/test_json",
            method,
            testReq,
            new ParameterizedTypeReference<Map<String, Object>>() {
            });
        Map<String, Object> body = testResp == null ? null : testResp.getBody();
        if (testResp != null && testResp.getStatusCode() == HttpStatus.OK && body != null) {
        Object totalObj = body.get("total");
        Object correctObj = body.get("correct");
        Object accObj = body.get("accuracy");
        result.testSize = totalObj == null ? 0 : ((Number) totalObj).intValue();
        result.correct = correctObj == null ? 0 : ((Number) correctObj).intValue();
        result.accuracy = accObj == null ? 0.0 : ((Number) accObj).doubleValue();
        result.trainingChunks = nChunks - 1;
        result.message = "OK";
      } else {
        result.message = "Test request failed";
      }
    } catch (RestClientException e) {
      result.message = "Communication error: " + e.getMessage();
    }

    return result;
  }
}
