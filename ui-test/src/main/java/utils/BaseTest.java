package utils;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Field;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.json.JSONObject;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.SkipException;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.Status;
import com.aventstack.extentreports.cucumber.adapter.ExtentCucumberAdapter;
import com.browserstack.local.Local;

import api.InjiWebConfigManager;
import api.InjiWebUtil;
import io.cucumber.java.After;
import io.cucumber.java.AfterAll;
import io.cucumber.java.AfterStep;
import io.cucumber.java.Before;
import io.cucumber.java.BeforeStep;
import io.cucumber.java.Scenario;
import io.cucumber.plugin.event.PickleStepTestStep;
import io.cucumber.plugin.event.TestStep;
import io.mosip.testrig.apirig.utils.ConfigManager;
import io.mosip.testrig.apirig.utils.S3Adapter;

public class BaseTest {
	public void setDriver(WebDriver driver) {
		this.driver = driver;
	}

	private static int passedCount = 0;
	private static int failedCount = 0;
	private static int totalCount = 0;
	private static int skippedCount = 0;
	public static WebDriver driver;
	private long scenarioStartTime;
	public static JavascriptExecutor jse;
	private static ExtentReports extent;
	private static ThreadLocal<ExtentTest> test = new ThreadLocal<>();
	String username = System.getenv("BROWSERSTACK_USERNAME");
	String accessKey = System.getenv("BROWSERSTACK_ACCESS_KEY");
	public final String URL = "https://" + username + ":" + accessKey + "@hub-cloud.browserstack.com/wd/hub";
	private Scenario scenario;
	private static final Logger logger = LoggerFactory.getLogger(BaseTest.class);
	private static ThreadLocal<Boolean> skipScenario = ThreadLocal.withInitial(() -> false);
	private static ThreadLocal<String> skipReason = new ThreadLocal<>();

	public static final String url = System.getenv("TEST_URL") != null && !System.getenv("TEST_URL").isEmpty()
			? System.getenv("TEST_URL")
			: InjiWebConfigManager.getproperty("injiWebUi");

	public static boolean isScenarioSkipped() {
		return skipScenario.get();
	}

	public static String getSkipReason() {
		return skipReason.get();
	}

	public static void markScenarioSkipped(String reason) {
		skipScenario.set(true);
		skipReason.set(reason);
	}

	public static void clearSkip() {
		skipScenario.set(false);
		skipReason.remove();
	}

	@Before
	public void beforeAll(Scenario scenario) throws MalformedURLException {
		clearSkip();
		Local bsLocal = new Local();
		HashMap<String, String> bsLocalArgs = new HashMap<>();
		bsLocalArgs.put("key", accessKey);
		try {
			bsLocal.start(bsLocalArgs);
		} catch (Exception e) {
			e.printStackTrace();
		}
		totalCount++;
		ExtentReportManager.initReport();
		ExtentReportManager.createTest(scenario.getName());
		ExtentReportManager.logStep("Scenario Started: " + scenario.getName());
		DesiredCapabilities capabilities = new DesiredCapabilities();
		capabilities.setCapability("browserName", "Chrome");
		capabilities.setCapability("browserVersion", "latest");
		HashMap<String, Object> browserstackOptions = new HashMap<String, Object>();
		browserstackOptions.put("os", "Windows");
		browserstackOptions.put("local", true);
		browserstackOptions.put("interactiveDebugging", true);
		capabilities.setCapability("bstack:options", browserstackOptions);

		driver = new RemoteWebDriver(new URL(URL), capabilities);
		jse = (JavascriptExecutor) driver;
		driver.manage().window().maximize();
		driver.get(url);
	}

	@Before("@skipBasedOnThreshold")
	public void skipScenarioBasedOnThreshold(Scenario scenario) {
		try {
			int retryBlockedUntil = getWalletPasscodeSettings().get("retryBlockedUntil");
			String envThreshold = System.getenv("THRESH_TEMP_LOCK");
			int THRESH_TEMP_LOCK = (envThreshold != null && !envThreshold.isEmpty()) ? Integer.parseInt(envThreshold)
					: 1;

			if (retryBlockedUntil > THRESH_TEMP_LOCK) {
				String reason = "Threshold not met: retryBlockedUntil(" + retryBlockedUntil + ") < THRESH_TEMP_LOCK("
						+ THRESH_TEMP_LOCK + ")";
				markScenarioSkipped(reason);
				throw new SkipException("Scenario skipped due to threshold: " + reason);
			}
		} catch (Exception e) {
			logger.error("Error checking threshold for skipping scenario", e);
		}
	}

	@BeforeStep
	public void beforeStep(Scenario scenario) {
		String stepName = getStepName(scenario);
		if (isScenarioSkipped()) {
			ExtentCucumberAdapter.getCurrentStep().log(Status.SKIP,
					"⏭ Step Skipped: " + stepName + " — " + getSkipReason());
			throw new io.cucumber.java.PendingException("Scenario skipped: " + getSkipReason());
		}
		ExtentCucumberAdapter.getCurrentStep().log(Status.INFO, "➡️ Step Started: " + stepName);
	}

	@AfterStep
	public void afterStep(Scenario scenario) {
		String stepName = getStepName(scenario);
		if (isScenarioSkipped()) {
			ExtentCucumberAdapter.getCurrentStep().log(Status.SKIP,
					"⏭ Step Skipped: " + stepName + " — " + getSkipReason());
			return;
		}

		if (scenario.isFailed()) {
			ExtentCucumberAdapter.getCurrentStep().log(Status.FAIL, "❌ Step Failed: " + stepName);
			captureScreenshot();
		} else {
			ExtentCucumberAdapter.getCurrentStep().log(Status.PASS, "✅ Step Passed: " + stepName);
		}
	}

	@After
	public void afterScenario(Scenario scenario) {
		try {
			if (isScenarioSkipped()) {
				skippedCount++;
				ExtentReportManager.getTest()
						.skip("⏭ Scenario Skipped: " + scenario.getName() + " — " + getSkipReason());
			} else if (scenario.isFailed()) {
				failedCount++;
				ExtentReportManager.getTest().fail("❌ Scenario Failed: " + scenario.getName());
			} else {
				passedCount++;
				ExtentReportManager.getTest().pass("✅ Scenario Passed: " + scenario.getName());
			}
		} finally {
			if (driver != null) {
				try {
					driver.quit();
					logger.info("✅ WebDriver instance quit successfully after scenario: {}", scenario.getName());
				} catch (Exception e) {
					logger.error("❌ Error while quitting WebDriver after scenario: {}", scenario.getName(), e);
				} finally {
					driver = null; // ensure cleanup
				}
			}
			ExtentReportManager.flushReport();
			clearSkip();
		}
	}

	private String getStepName(Scenario scenario) {
		try {
			Field testCaseField = scenario.getClass().getDeclaredField("testCase");
			testCaseField.setAccessible(true);
			io.cucumber.plugin.event.TestCase testCase = (io.cucumber.plugin.event.TestCase) testCaseField
					.get(scenario);
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
					java.util.Base64.getEncoder().encodeToString(screenshot), "Failure Screenshot");
		}
	}

	@AfterAll
	public static void afterAll() {
		Runtime.getRuntime().addShutdownHook(new Thread(() -> {
			utils.HttpUtils.cleanupWallets();
			utils.HttpUtils.cleanupWallets();
			if (extent != null) {
				extent.flush();
			}
			try {
				Thread.sleep(5000); // ensure report file is flushed before rename
			} catch (InterruptedException e) {
				e.printStackTrace();
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

		executeLsCommand(System.getProperty("user.dir") + "/test-output/");
		String originalFileName = ExtentReportManager.getCurrentReportFileName();
		File originalReportFile = new File(System.getProperty("user.dir") + "/test-output/" + originalFileName);
		String nameWithoutExt = originalFileName.replace(".html", "");
		String newFileName = nameWithoutExt + "-T-" + totalCount + "-P-" + passedCount + "-F-" + failedCount + "-S-"
				+ skippedCount + ".html";
		File newReportFile = new File(System.getProperty("user.dir") + "/test-output/" + newFileName);

		System.out.println("Attempting to rename report file...");
		System.out.println("Original: " + originalReportFile.getAbsolutePath());
		System.out.println("Target:   " + newReportFile.getAbsolutePath());

		if (originalReportFile.renameTo(newReportFile)) {
			System.out.println("✅ Report renamed to: " + newFileName);
		} else {
			System.out.println("❌ Failed to rename the report file.");
		}

		executeLsCommand(newReportFile.getAbsolutePath());

		if (ConfigManager.getPushReportsToS3().equalsIgnoreCase("yes")) {
			S3Adapter s3Adapter = new S3Adapter();
			boolean isStoreSuccess = false;
			try {
				isStoreSuccess = s3Adapter.putObject(ConfigManager.getS3Account(), "", null, null, newFileName,
						newReportFile);
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
				String windowsDirectoryPath = directoryPath.replace("/", File.separator);
				process = Runtime.getRuntime().exec(new String[] { "cmd.exe", "/c", "dir /a " + windowsDirectoryPath });
			} else {
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

	public static String[] fetchIssuerTexts() {
		String issuerSearchText = System.getenv("issuerSearchText");
		String issuerSearchTextforSunbird = System.getenv("issuerSearchTextforSunbird");

		if (issuerSearchText == null || issuerSearchTextforSunbird == null) {
			String propertyFilePath = System.getProperty("user.dir") + "/src/test/resources/config.properties";
			Properties properties = new Properties();

			try (FileInputStream fileInputStream = new FileInputStream(propertyFilePath)) {
				properties.load(fileInputStream);

				if (issuerSearchText == null) {
					issuerSearchText = properties.getProperty("issuerSearchText");
				}

				if (issuerSearchTextforSunbird == null) {
					issuerSearchTextforSunbird = properties.getProperty("issuerSearchTextforSunbird");
				}

			} catch (IOException e) {
				logger.error("Failed to load config.properties from {}", propertyFilePath, e);
			}
		}

		return new String[] { issuerSearchText, issuerSearchTextforSunbird };
	}

	private static HashMap<String, Integer> walletPasscodeSettingsCache;

	public static HashMap<String, Integer> getWalletPasscodeSettings() throws Exception {
		if (walletPasscodeSettingsCache == null) {
			HashMap<String, String> keyMap = new HashMap<>();
			keyMap.put("wallet.passcode.retryBlockedUntil", "retryBlockedUntil");
			keyMap.put("wallet.passcode.maxFailedAttemptsAllowedPerCycle", "maxFailedAttempts");
			keyMap.put("wallet.passcode.maxLockCyclesAllowed", "maxLockCycles");

			walletPasscodeSettingsCache = InjiWebUtil.getActuatorValues(keyMap);
		}
		return walletPasscodeSettingsCache;
	}
}