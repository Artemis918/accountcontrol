package loc.balsen.accountcontrol.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import loc.balsen.accountcontrol.data.AccountRecord;
import loc.balsen.accountcontrol.data.Assignment;
import loc.balsen.accountcontrol.data.Plan;
import loc.balsen.accountcontrol.data.SubCategory;
import loc.balsen.accountcontrol.data.Template;
import loc.balsen.accountcontrol.dataservice.AssignmentService;
import loc.balsen.accountcontrol.dataservice.TemplateService;
import loc.balsen.accountcontrol.dto.AssignmentDTO;
import loc.balsen.accountcontrol.dto.MessageID;
import loc.balsen.accountcontrol.dto.TemplateDTO;
import loc.balsen.accountcontrol.repositories.AccountRecordRepository;
import loc.balsen.accountcontrol.repositories.AssignmentRepository;
import loc.balsen.accountcontrol.repositories.PlanRepository;
import loc.balsen.accountcontrol.repositories.SubCategoryRepository;

@Controller
@RequestMapping("/assign")
@ResponseBody
public class AssignmentController {

  private SubCategoryRepository subCategoryRepository;
  private AssignmentRepository assignRepository;
  private AssignmentService assignService;
  private TemplateService templateService;
  private AccountRecordRepository accountRecordRepository;
  private PlanRepository planRepository;

  @Autowired
  public AssignmentController(SubCategoryRepository subCategoryRepository,
      AssignmentRepository assignmentRepository, AssignmentService assignmentService,
      TemplateService templateService, AccountRecordRepository accountRecordRepository,
      PlanRepository planRepository) {
    this.subCategoryRepository = subCategoryRepository;
    this.assignRepository = assignmentRepository;
    this.assignService = assignmentService;
    this.templateService = templateService;
    this.accountRecordRepository = accountRecordRepository;
    this.planRepository = planRepository;
  }

  @GetMapping("/all")
  public Integer assignAll() {
    List<AccountRecord> records = accountRecordRepository.findUnresolvedRecords();
    int count = assignService.assign(records);
    return Integer.valueOf(count);
  }

  @GetMapping("/getcategory/{year}/{month}/{id}")
  public List<AssignmentDTO> getCategory(@PathVariable int id, @PathVariable int month,
      @PathVariable int year) {
    List<Assignment> assignments = new ArrayList<>();
    List<SubCategory> subcategories =
        subCategoryRepository.findByCategoryIdOrderByShortDescription(id);
    LocalDate start = LocalDate.of(year, month, 1);
    LocalDate end = LocalDate.of(year, month, start.lengthOfMonth());
    for (SubCategory subcategory : subcategories) {
      assignments
          .addAll(assignRepository.findBySubCategoryAndMonth(start, end, subcategory.getId()));
    }

    List<AssignmentDTO> zdtos = assignments.stream().map(z -> {
      return new AssignmentDTO(z);
    }).collect(Collectors.toList());

    zdtos.addAll(planRepository.findByPlanDateNotAssigned(start, end).stream().filter(p -> {
      return contains(p, subcategories);
    }).map(p -> {
      return new AssignmentDTO(p);
    }).collect(Collectors.toList()));

    zdtos.sort((z1, z2) -> z1.compareCategory(z2));
    return zdtos;
  }

  private boolean contains(Plan p, List<SubCategory> subcategories) {
    return subcategories.contains(p.getSubCategory());
  }

  @GetMapping("/getsubcategory/{year}/{month}/{id}")
  public List<AssignmentDTO> getSubcategory(@PathVariable int id, @PathVariable int month,
      @PathVariable int year) {
    LocalDate start = LocalDate.of(year, month, 1);
    LocalDate end = LocalDate.of(year, month, start.lengthOfMonth());

    List<AssignmentDTO> assignments =
        assignRepository.findBySubCategoryAndMonth(start, end, id).stream().map(z -> {
          return new AssignmentDTO(z);
        }).collect(Collectors.toList());

    assignments.addAll(planRepository.findByPlanDateNotAssigned(start, end).stream()
        .filter(p -> p.getSubCategory().getId() == id).map(p -> {
          return new AssignmentDTO(p);
        }).collect(Collectors.toList()));

    assignments.sort((z1, z2) -> z1.comparePosition(z2));
    return assignments;
  }

  @PostMapping(path = "/countsubcategory", produces = MediaType.TEXT_PLAIN_VALUE)
  String countAssignForSubCategory(@RequestBody List<Integer> subs) {
    int result = 0;
    for (Integer sub : subs) {
      result += assignService.getAssignCount(sub);
    }
    return Integer.toString(result);
  }

  @PostMapping("/commit")
  public MessageID commit(@RequestBody List<Integer> ids) {
    for (Integer id : ids) {
      Optional<Assignment> assignment = assignRepository.findById(id);
      if (assignment.isPresent()) {
        Assignment z = assignment.get();
        z.setCommitted(true);
        assignRepository.save(z);
      }
    }
    return MessageID.ok;
  }

  @GetMapping("/invertcommit/{id}")
  public MessageID invertCommit(@PathVariable int id) {
    Optional<Assignment> assignment = assignRepository.findById(id);
    if (assignment.isPresent()) {
      Assignment z = assignment.get();
      z.setCommitted(!z.isCommitted());
      assignRepository.save(z);
    }
    return MessageID.ok;
  }

  @PostMapping("/remove")
  public MessageID remove(@RequestBody List<Integer> ids) {
    for (Integer id : ids) {
      assignRepository.deleteByAccountrecordId(id);
    }
    return MessageID.ok;
  }

  static class ToCategoryRequestDTO {
    public int subcategory;
    public String text;
    public List<Integer> ids;
  }

  @PostMapping("/tosubcategory")
  public MessageID assignToCategory(@RequestBody ToCategoryRequestDTO request) {
    SubCategory subcategory = subCategoryRepository.findById(request.subcategory).orElseThrow();

    request.ids.forEach((Integer z) -> assignService.assignToSubCategory(subcategory, request.text,
        accountRecordRepository.findById(z).orElseThrow()));
    return MessageID.ok;
  }

  @GetMapping("/toplan/{planid}/{recordid}")
  public MessageID assignToPlan(@PathVariable int planid, @PathVariable int recordid) {
    assignService.assignToPlan(planRepository.findById(planid).orElseThrow(),
        accountRecordRepository.findById(recordid).orElseThrow());
    return MessageID.ok;
  }

  @PostMapping("/parts")
  public MessageID assignParts(@RequestBody List<AssignmentDTO> request) {

    request.forEach((AssignmentDTO z) -> {
      if (z.getReal() != 0)
        assignRepository
            .save(z.toAssignment(planRepository, subCategoryRepository, accountRecordRepository));
    });
    return MessageID.ok;
  }

  @GetMapping("/endplan/{id}")
  MessageID endplan(@PathVariable Integer id) {
    Plan plan = planRepository.findById(id).orElseThrow();
    if (plan.getTemplate() != null) {
      Template template = plan.getTemplate();
      template.setValidUntil(plan.getStartDate());
      templateService.saveTemplate(template);
    }
    return MessageID.ok;
  }

  @GetMapping("/newvalue/{assignmentId}")
  MessageID setNewValue(@PathVariable Integer assignmentId) {
    Assignment assignment = assignRepository.findById(assignmentId).orElseThrow();
    if (assignment.getPlan() != null && assignment.getPlan().getTemplate() != null) {
      AccountRecord record = assignment.getAccountrecord();
      Template template = assignment.getPlan().getTemplate()
          .copyWithNewValue(assignment.getPlan().getPlanDate(), record.getValue());

      assignRepository.delete(assignment);
      templateService.saveTemplate(template);

      List<AccountRecord> list = new ArrayList<AccountRecord>();
      list.add(record);
      assignService.assign(list);
    }
    return MessageID.ok;
  }

  @GetMapping("/analyze/{recordid}/{planid}")
  TemplateDTO analyzePlan(@PathVariable Integer recordid, @PathVariable Integer planid) {
    Plan plan = planRepository.findById(planid).get();
    if (plan != null && plan.getTemplate() != null) {
      Template template = plan.getTemplate();
      AccountRecord record = accountRecordRepository.findById(recordid).get();
      String result = plan.matches(record) ? "0" : "1";
      result += plan.isInPeriod(record.getExecuted()) ? "0" : "1";
      return new TemplateDTO(template, result, record.getExecuted());
    } else {
      return new TemplateDTO(null, "", null);
    }
  }
}
