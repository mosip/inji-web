package runnerfiles;

import io.cucumber.junit.Cucumber;
import io.cucumber.testng.AbstractTestNGCucumberTests;
import io.cucumber.testng.CucumberOptions;
import io.cucumber.testng.CucumberOptions.SnippetType;
import io.cucumber.testng.FeatureWrapper;
import io.cucumber.testng.PickleWrapper;
import io.mosip.testrig.apirig.testrunner.BaseTestCase;
import io.mosip.testrig.apirig.testrunner.ExtractResource;
import io.mosip.testrig.apirig.utils.GlobalConstants;
import io.mosip.testrig.apirig.utils.RunConfigUtil;
import org.apache.commons.io.FileUtils;
import org.junit.runner.RunWith;
import org.testng.ITestResult;
import org.testng.TestNG;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import static com.itextpdf.xmp.XMPDateTimeFactory.getCurrentDateTime;

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
	private static String cachedPath = null;
	public static String environment;
	public static String jarUrl = Runner.class.getProtectionDomain().getCodeSource().getLocation().getPath();
	protected static String jarURLS = "";
	public static String runTypeS = "IDE";
//	private static final Logger LOGGER = Logger.getLogger(Runner.class);
	public static void main(String[] args) {
		BaseTestCase.setRunContext(getRunType(), jarUrl);
		ExtractResource.removeOldMosipTestTestResource();
		if (getRunType().equalsIgnoreCase("JAR")) {
			ExtractResource.extractCommonResourceFromJar();
		} else {
			copymoduleSpecificAndConfigFile("injiweb");
		}
		File homeDir = null;
		String os = System.getProperty("os.name");
		if (getRunType().contains("IDE") || os.toLowerCase().contains("windows")) {
			homeDir = new File(System.getProperty("user.dir") + "/testNgXmlFiles");
//			LOGGER.info("IDE :" + homeDir);
		} else {
			File dir = new File(System.getProperty("user.dir"));
			homeDir = new File(dir.getParent() + "/mosip/testNgXmlFiles");
//			LOGGER.info("ELSE :" + homeDir);
		}


		File[] files = homeDir.listFiles();
		if (files != null) {
			for (File file : files) {
				TestNG runner = new TestNG();
				List<String> suitefiles = new ArrayList<>();
				if (file.getName().toLowerCase().contains("mastertestsuite")) {
					Runner.setReportName("ui-test");
					suitefiles.add(file.getAbsolutePath());
					runner.setTestSuites(suitefiles);
					System.getProperties().setProperty("testng.outpur.dir", "testng-report");
					runner.setOutputDirectory("testng-report");
					runner.run();
				}
			}
		} else {
//			LOGGER.error("No files found in directory: " + homeDir);
		}

		try {

//			  String os = System.getProperty("os.name").toLowerCase();
//			  String featurePath;
//
//			  if (os.contains("win")) {
//				  featurePath = "src/test/resources/featurefiles/";
//			  } else {
//				  featurePath = "/home/mosip/featurefiles/";
//			  }
//			  System.setProperty("cucumber.features", featurePath);
//	            BaseTestCase.intiateUINGenration();
//	            Thread.sleep(18000);
//	            TestNG testng = new TestNG();
//
//	            String testNgXmlPath = System.getProperty("user.dir") + "/TestNg.xml";
//	            System.out.println("Path of the TestNG XML: " + testNgXmlPath);
//	            testng.setTestSuites(Collections.singletonList(testNgXmlPath));
//
//	            testng.run();

			System.out.println("Test execution completed. Check reports for details.");
		} catch (Exception e) {
			System.err.println("Error occurred during test execution: " + e.getMessage());
			e.printStackTrace();
		}
	}

	public static String getRunType() {
		if (Runner.class.getResource("Runner.class").getPath().contains(".jar"))
			return "JAR";
		else
			return "IDE";
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


	public static String getGlobalResourcePath() {
		if (cachedPath != null) {
			return cachedPath;
		}

		String path = null;
		if (getRunType().equalsIgnoreCase("JAR")) {
			path = new File(jarUrl).getParentFile().getAbsolutePath() + "/";
		} else if (getRunType().equalsIgnoreCase("IDE")) {
			path = new File(Runner.class.getClassLoader().getResource("").getPath()).getAbsolutePath()
					+ "/";
			if (path.contains(GlobalConstants.TESTCLASSES))
				path = path.replace(GlobalConstants.TESTCLASSES, "classes");
		}

		if (path != null) {
			cachedPath = path;
			return path;
		} else {
			return "Global Resource File Path Not Found";
		}
	}

	public static String getResourcePath() {
		return getGlobalResourcePath();
	}

	public static void setRunContext(String runType, String jarURL) {
		runTypeS = runType;
		jarURLS = jarURL;
	}

	public static void copymoduleSpecificAndConfigFile(String moduleName) {
		if (runTypeS.equalsIgnoreCase("JAR")) {
			ExtractResource.getListOfFilesFromJarAndCopyToExternalResource(moduleName + "/");
		} else {
			try {
				File destination = new File(RunConfigUtil.getGlobalResourcePath());
				File source = new File(RunConfigUtil.getGlobalResourcePath()
						.replace("classes/", "test-classes") + moduleName);
				FileUtils.copyDirectoryToDirectory(source, destination);
//				logger.info("Copied the test resource successfully for " + moduleName);
			} catch (Exception e) {
//				logger.error(
//						"Exception occured while copying the file for : " + moduleName + " Error : " + e.getMessage());
			}
		}

	}

	public static void setReportName(String moduleName) {
		System.getProperties().setProperty("emailable.report2.name",
				"mosip-" + environment + "-" + moduleName + "-" + getCurrentDateTime() + "-report.html");
	}


}
