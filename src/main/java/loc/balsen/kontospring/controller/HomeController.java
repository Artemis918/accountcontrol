package loc.balsen.kontospring.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import lombok.Data;

@Controller
public class HomeController {

	@Autowired
	Environment env;
	
	@GetMapping(value = "/")
	public String index() {
		return "index";
	}

	@Data
	class ProdDTO {
		private Boolean production;
		public ProdDTO(Boolean b) {production = b;}
	}
	
	@GetMapping("/production")
	@ResponseBody
	 ProdDTO isProduction() {
		return new ProdDTO(env.getActiveProfiles().length <= 0);
	}
}
