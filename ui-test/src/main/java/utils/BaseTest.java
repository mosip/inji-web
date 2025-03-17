package utils;

import io.cucumber.java.*;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;
import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.cucumber.adapter.ExtentCucumberAdapter;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;

import api.InjiWebTestUtil;
import api.ConfigManager;
import api.S3Adapter;

import io.cucumber.java.Scenario;
import io.cucumber.java.BeforeStep;
import io.cucumber.plugin.event.PickleStepTestStep;
import io.cucumber.plugin.event.TestStep;

import com.aventstack.extentreports.Status;
import java.lang.reflect.Field;
import java.net.MalformedURLException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.io.*;

public class BaseTest {
	public void setDriver(WebDriver driver) {
		this.driver = driver;
	}
	
	

	public static WebDriver driver;

	public static final String url = System.getenv("env") != null ? System.getenv("TEST_URL")
			: "https://injiweb.qa-inji1.mosip.net/";

	private long scenarioStartTime;
	public static JavascriptExecutor jse;
	public String PdfNameForMosip = "MosipVerifiableCredential.pdf";
	public String PdfNameForInsurance = "InsuranceCredential.pdf";
	public String PdfNameForLifeInsurance = "InsuranceCredential.pdf";
	 private static ExtentReports extent;
	 private static ThreadLocal<ExtentTest> test = new ThreadLocal<>();

	String username = System.getenv("BROWSERSTACK_USERNAME");
	String accessKey = System.getenv("BROWSERSTACK_ACCESS_KEY");
	public final String URL = "https://" + username + ":" + accessKey + "@hub-cloud.browserstack.com/wd/hub";

	private Scenario scenario;

	@Before
	public void beforeAll(Scenario scenario) throws MalformedURLException {
		
		   ExtentReportManager.initReport();
	        ExtentReportManager.createTest(scenario.getName()); // Start logging for the scenario
	        ExtentReportManager.logStep("Scenario Started: " + scenario.getName());
	        
		DesiredCapabilities capabilities = new DesiredCapabilities();
		capabilities.setCapability("browserName", "Chrome");
		capabilities.setCapability("browserVersion", "latest");
		HashMap<String, Object> browserstackOptions = new HashMap<String, Object>();
		browserstackOptions.put("os", "Windows");
		browserstackOptions.put("osVersion", "10");
		capabilities.setCapability("bstack:options", browserstackOptions);

		driver = new RemoteWebDriver(new URL(URL), capabilities);
		jse = (JavascriptExecutor) driver;
		driver.manage().window().maximize();
		driver.get(url);
	}
	   
	   
    @BeforeStep
    public void beforeStep(Scenario scenario) {
        String stepName = getStepName(scenario);
        ExtentCucumberAdapter.getCurrentStep().log(Status.INFO, "➡️ Step Started: " + stepName);
    }
	    
    @AfterStep
    public void afterStep(Scenario scenario) {
        String stepName = getStepName(scenario);

        if (scenario.isFailed()) {
            ExtentCucumberAdapter.getCurrentStep().log(Status.FAIL, "❌ Step Failed: " + stepName);
            captureScreenshot();
        } else {
            ExtentCucumberAdapter.getCurrentStep().log(Status.PASS, "✅ Step Passed: " + stepName);
        }
    }
	
	@After
	public void after(Scenario scenario) {
		
        if (scenario.isFailed()) {
            ExtentReportManager.logStep("Scenario Failed: " + scenario.getName());
        } else {
            ExtentReportManager.logStep("Scenario Passed: " + scenario.getName());
        }
        ExtentReportManager.flushReport();
    }


	
	
    private String getStepName(Scenario scenario) {
        try {
            Field testCaseField = scenario.getClass().getDeclaredField("testCase");
            testCaseField.setAccessible(true);
            io.cucumber.plugin.event.TestCase testCase = (io.cucumber.plugin.event.TestCase) testCaseField.get(scenario);
            List<TestStep> testSteps = testCase.getTestSteps();

            for (TestStep step : testSteps) {
                if (step instanceof PickleStepTestStep) {
                    return ((PickleStepTestStep) step).getStep().getText();
                }
            }
        } catch (Exception e) {
            return "Unknown Step";
        }
        return "Unknown Step";
    }
    
    private void captureScreenshot() {
        if (driver != null) {
            byte[] screenshot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
            ExtentCucumberAdapter.getCurrentStep().addScreenCaptureFromBase64String(
                    java.util.Base64.getEncoder().encodeToString(screenshot),
                    "Failure Screenshot"
            );
        }
    }

	
	@AfterAll
	public static void afterAll() {
		Runtime.getRuntime().addShutdownHook(new Thread(() -> {
			System.out.println("Shutdown hook triggered. Uploading report...");
//            pushReportsToMinio();
			InjiWebTestUtil.deleteInsurance();
            if (extent != null) {
                extent.flush();
            }
            pushReportsToS3();
		}));

	}

	public WebDriver getDriver() {
		return driver;
	}

	public JavascriptExecutor getJse() {
		return jse;
	}

	public static void pushReportsToS3() {
		executeLsCommand(System.getProperty("user.dir") + "/test-output/ExtentReport.html");
		executeLsCommand(System.getProperty("user.dir") + "/utils/");
		executeLsCommand(System.getProperty("user.dir") + "/screenshots/");

		try {
			Thread.sleep(20000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}

		executeLsCommand(System.getProperty("user.dir") + "/test-output/");

		// Generate day and formatted date
		String timestamp = new SimpleDateFormat("EEEE-yyyy-MM-dd-HH-mm").format(new Date());
		String newFileName = "InjiWebUi-" + timestamp + ".html";
		File originalReportFile = new File(System.getProperty("user.dir") + "/test-output/ExtentReport.html");
		File newReportFile = new File(System.getProperty("user.dir") + "/test-output/" + newFileName);

		// Rename the file
		if (originalReportFile.renameTo(newReportFile)) {
			System.out.println("Report renamed to: " + newFileName);
		} else {
			System.out.println("Failed to rename the report file.");
		}

		executeLsCommand(newReportFile.getAbsolutePath());

		if (ConfigManager.getPushReportsToS3().equalsIgnoreCase("yes")) {
			S3Adapter s3Adapter = new S3Adapter();
			boolean isStoreSuccess = false;
			try {
				isStoreSuccess = s3Adapter.putObject(
						ConfigManager.getS3Account(),
						System.getProperty("modules"),
						null, null,
						newFileName,
						newReportFile
				);
				System.out.println("isStoreSuccess:: " + isStoreSuccess);
			} catch (Exception e) {
				System.out.println("Error occurred while pushing the object: " + e.getLocalizedMessage());
				System.out.println(e.getMessage());
			}
		}
	}

	private static void executeLsCommand(String directoryPath) {
		try {
			String os = System.getProperty("os.name").toLowerCase();
			Process process;

			if (os.contains("win")) {
				// Windows command (show all files including hidden)
				String windowsDirectoryPath = directoryPath.replace("/", File.separator);
				process = Runtime.getRuntime().exec(new String[] { "cmd.exe", "/c", "dir /a " + windowsDirectoryPath });
			} else {
				// Unix-like command (show all files including hidden)
				process = Runtime.getRuntime().exec(new String[] { "/bin/sh", "-c", "ls -al " + directoryPath });
			}

			BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
			String line;
			System.out.println("--- Directory listing for " + directoryPath + " ---");
			while ((line = reader.readLine()) != null) {
				System.out.println(line);
			}

			int exitCode = process.waitFor();
			if (exitCode != 0) {
				BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
				String errorLine;
				System.err.println("--- Directory listing error ---");
				while ((errorLine = errorReader.readLine()) != null) {
					System.err.println(errorLine);
				}
			}
			System.out.println("--- End directory listing ---");

		} catch (IOException | InterruptedException e) {
			System.err.println("Error executing directory listing command: " + e.getMessage());
		}
	}



}