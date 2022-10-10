package loc.balsen.accountcontrol.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;


@Controller
@ResponseBody
public class HomeController {

  @Autowired
  Environment env;

  class ProdDTO {
    @SuppressWarnings("unused")
    private Boolean production;

    public ProdDTO(Boolean b) {
      production = b;
    }
  }

  @GetMapping("/production")
  ProdDTO isProduction() {
    return new ProdDTO(env.getActiveProfiles().length <= 0);
  }
}
