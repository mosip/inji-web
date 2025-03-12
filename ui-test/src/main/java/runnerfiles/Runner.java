package runnerfiles;

import api.BaseTestCase;
import api.GlobalConstants;

import org.junit.runner.RunWith;
import io.cucumber.junit.Cucumber;
import io.cucumber.testng.CucumberOptions.SnippetType;
import io.cucumber.testng.FeatureWrapper;
import io.cucumber.testng.PickleWrapper;
import io.cucumber.testng.AbstractTestNGCucumberTests;
import io.cucumber.testng.CucumberOptions;

import org.testng.ITestResult;
import org.testng.TestNG;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import java.util.Collections;

@RunWith(Cucumber.class)
@CucumberOptions(
		features = {"/home/mosip/featurefiles/"},
		dryRun = false,
		glue = {"stepdefinitions", "utils"},
		snippets = SnippetType.CAMELCASE,
		monochrome = true,
				plugin = {"pretty",
						"html:reports",
						"html:target/cucumber.html", "json:target/cucumber.json",
						"summary","com.aventstack.extentreports.cucumber.adapter.ExtentCucumberAdapter:"}
		//tags = "@smoke"		
		)
public class Runner extends AbstractTestNGCucumberTests{
	public static void main(String[] args) {
	      try {
	            BaseTestCase.intiateUINGenration();
	            Thread.sleep(18000);
	            TestNG testng = new TestNG();

	            String testNgXmlPath = System.getProperty("user.dir") + "/TestNg.xml";
	            System.out.println("Path of the TestNG XML: " + testNgXmlPath);
	            testng.setTestSuites(Collections.singletonList(testNgXmlPath));
	           
	            testng.run();

	            System.out.println("Test execution completed. Check reports for details.");
	        } catch (Exception e) {
	            System.err.println("Error occurred during test execution: " + e.getMessage());
	            e.printStackTrace();
	        }
	}
	
	@Override
	@DataProvider(parallel = false)
	public Object[][] scenarios() {
	    Object[][] scenarios = super.scenarios();
	    System.out.println("Number of scenarios provided: " + scenarios.length);
	    
	    for (Object[] scenario : scenarios) {
	        if (scenario.length > 0 && scenario[0] instanceof PickleWrapper) {
	            System.out.println("Scenario Name: " + ((PickleWrapper) scenario[0]).getPickle().getName());
	        } else {
	            System.out.println("Scenario data is not as expected!");
	        }
	    }
	    
	    return scenarios;
	}
	
	@BeforeMethod
    public void setTestName(ITestResult result) {
        result.getMethod().setDescription("Running Scenario: " + result.getMethod().getMethodName());
    }



    @Test(dataProvider = "scenarios")
    public void runScenario(PickleWrapper pickle, FeatureWrapper feature) {
        System.out.println("Running Scenario: " + pickle.getPickle().getName());
        Thread.currentThread().setName(pickle.getPickle().getName());
        super.runScenario(pickle, feature);
    }

}
