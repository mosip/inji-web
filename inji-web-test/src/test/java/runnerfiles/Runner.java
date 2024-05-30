package runnerfiles;

import org.junit.runner.RunWith;

import io.cucumber.junit.Cucumber;
import io.cucumber.testng.CucumberOptions.SnippetType;
import io.cucumber.testng.AbstractTestNGCucumberTests;
import io.cucumber.testng.CucumberOptions;

@RunWith(Cucumber.class)
@CucumberOptions(
		features = {"src/test/resources/featurefiles/"},
		dryRun = !true,
		glue = {"stepdefinitions", "utils"},
		snippets = SnippetType.CAMELCASE,
		monochrome = true,
		plugin = {"pretty",
				"html:reports",
				"summary"}
		//tags = "@smoke"		
		)

public class Runner extends AbstractTestNGCucumberTests{

}
