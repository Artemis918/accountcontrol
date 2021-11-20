package loc.balsen.kontospring.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import java.time.LocalDate;
import java.util.ArrayList;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import loc.balsen.kontospring.dataservice.StatsService;
import loc.balsen.kontospring.testutil.TestContext;

@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
@WebAppConfiguration
public class StatsControllerTest extends TestContext {

  @MockBean
  private StatsService statistikServiceMock;

  @Autowired
  MockMvc mvc;

  private ArrayList<Integer> assigns;

  private ArrayList<Integer> plans;

  private AutoCloseable closeable;

  @BeforeEach
  public void setup() {
    closeable = MockitoAnnotations.openMocks(this);
    createCategoryData();
  }

  @AfterEach
  public void teardown() throws Exception {
    clearRepos();
    closeable.close();
  }

  @Test
  public void testRestApi() throws Exception {
    assigns = new ArrayList<Integer>();
    assigns.add(Integer.valueOf(2));
    assigns.add(Integer.valueOf(3));
    assigns.add(Integer.valueOf(4));
    assigns.add(Integer.valueOf(4));
    assigns.add(Integer.valueOf(4));
    assigns.add(Integer.valueOf(4));
    plans = new ArrayList<Integer>();
    plans.add(Integer.valueOf(9));
    plans.add(Integer.valueOf(8));
    plans.add(Integer.valueOf(7));
    plans.add(Integer.valueOf(6));
    plans.add(Integer.valueOf(5));
    plans.add(Integer.valueOf(4));

    when(
        statistikServiceMock.getMonthlyCumulatedAssigns(any(LocalDate.class), any(LocalDate.class)))
            .thenReturn(assigns);
    when(statistikServiceMock.getMonthlyCumulatedPlan(any(LocalDate.class), any(LocalDate.class)))
        .thenReturn(plans);

    mvc.perform(get("/stats/real/2018/12/2019/5"))
        .andExpect(content().string(
            "{\"data\":[" + "{\"day\":\"2018-12-01\",\"value\":2,\"planvalue\":9,\"forecast\":0},"
                + "{\"day\":\"2019-01-01\",\"value\":3,\"planvalue\":8,\"forecast\":3},"
                + "{\"day\":\"2019-02-01\",\"value\":4,\"planvalue\":7,\"forecast\":2},"
                + "{\"day\":\"2019-03-01\",\"value\":0,\"planvalue\":6,\"forecast\":1},"
                + "{\"day\":\"2019-04-01\",\"value\":0,\"planvalue\":5,\"forecast\":0},"
                + "{\"day\":\"2019-05-01\",\"value\":0,\"planvalue\":4,\"forecast\":-1}"
                + "],\"min\":2,\"max\":9}"));
  }
}
