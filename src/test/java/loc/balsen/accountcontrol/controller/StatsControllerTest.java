package loc.balsen.accountcontrol.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import java.time.LocalDate;
import java.util.ArrayList;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import loc.balsen.accountcontrol.dataservice.StatsService;
import loc.balsen.accountcontrol.testutil.TestContext;

@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
@WebAppConfiguration
public class StatsControllerTest extends TestContext {

  @MockitoBean
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

    when(statistikServiceMock.getMonthlyAssigns(any(LocalDate.class), any(LocalDate.class),
        any(Boolean.class))).thenReturn(assigns);
    when(statistikServiceMock.getMonthlyPlan(any(LocalDate.class), any(LocalDate.class),
        any(Boolean.class))).thenReturn(plans);

    // @formatter:off
    mvc.perform(get("/stats/real/2018/12/2019/5/true"))
        .andExpect(jsonPath("min").value(2))
        .andExpect(jsonPath("max").value(9))
        .andExpect(jsonPath("data").isArray())
        .andExpect(jsonPath("data[*]", hasSize(6)))
        .andExpect(jsonPath("data[0].day").value("2018-12-01"))
        .andExpect(jsonPath("data[1].value").value(3))
        .andExpect(jsonPath("data[2].planvalue").value(7))
        .andExpect(jsonPath("data[3].forecast").value(1))
        .andExpect(jsonPath("data[4].day").value("2019-04-01"))
        .andExpect(jsonPath("data[5].forecast").value(-1));
    // @formatter:on

    // .andExpect(content().string(
    // "{\"data\":[" + "{\"day\":\"2018-12-01\",\"value\":2,\"planvalue\":9,\"forecast\":0},"
    // + "{\"day\":\"2019-01-01\",\"value\":3,\"planvalue\":8,\"forecast\":3},"
    // + "{\"day\":\"2019-02-01\",\"value\":4,\"planvalue\":7,\"forecast\":2},"
    // + "{\"day\":\"2019-03-01\",\"value\":0,\"planvalue\":6,\"forecast\":1},"
    // + "{\"day\":\"2019-04-01\",\"value\":0,\"planvalue\":5,\"forecast\":0},"
    // + "{\"day\":\"2019-05-01\",\"value\":0,\"planvalue\":4,\"forecast\":-1}"
    // + "],\"min\":2,\"max\":9}"));
  }
}
