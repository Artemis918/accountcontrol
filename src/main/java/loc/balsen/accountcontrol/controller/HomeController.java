package loc.balsen.accountcontrol.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;


@Controller
@RequestMapping
@ResponseBody
public class HomeController {

  @Autowired
  Environment env;

  @GetMapping("/production")
  Boolean isProduction() {
    return env.getProperty("PROD") != null;
  }
}
