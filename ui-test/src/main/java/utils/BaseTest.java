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

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.Status;
import com.aventstack.extentreports.cucumber.adapter.ExtentCucumberAdapter;
import com.browserstack.local.Local;

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
	public static WebDriver driver;
	private long scenarioStartTime;
	public static JavascriptExecutor jse;
	public String PdfNameForInsurance = "InsuranceCredential.pdf";
	public String PdfNameForLifeInsurance = "InsuranceCredential.pdf";
	private static ExtentReports extent;
	private static ThreadLocal<ExtentTest> test = new ThreadLocal<>();
	String username = System.getenv("BROWSERSTACK_USERNAME");
	String accessKey = System.getenv("BROWSERSTACK_ACCESS_KEY");
	public final String URL = "https://" + username + ":" + accessKey + "@hub-cloud.browserstack.com/wd/hub";
	private Scenario scenario;

	public static final String url = System.getenv("TEST_URL") != null && !System.getenv("TEST_URL").isEmpty()
			? System.getenv("TEST_URL")
			: loadFromProps("config/injiweb.properties", "injiWebUi");

	String mosipWellKnownUrl = (url.endsWith("/") ? url : url + "/").replace("injiweb", "injicertify-mosipid")
			+ "v1/certify/issuance/.well-known/openid-credential-issuer";

	public static String getCredentialConfigKey(String wellKnownUrl) throws Exception {
		HttpURLConnection conn = (HttpURLConnection) new URL(wellKnownUrl).openConnection();
		conn.setRequestMethod("GET");

		BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
		StringBuilder jsonText = new StringBuilder();
		String line;
		while ((line = in.readLine()) != null)
			jsonText.append(line);
		in.close();

		JSONObject json = new JSONObject(jsonText.toString());
		return json.getJSONObject("credential_configurations_supported").keys().next();
	}

	private static String loadFromProps(String path, String key) {
		Properties props = new Properties();
		try (InputStream input = BaseTest.class.getClassLoader().getResourceAsStream(path)) {
			if (input != null) {
				props.load(input);
				return props.getProperty(key); // returns null if not found
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}

	public String PdfNameForMosip = "";

	{
		try {
			PdfNameForMosip = getCredentialConfigKey(mosipWellKnownUrl) + ".pdf";
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Before
	public void beforeAll(Scenario scenario) throws MalformedURLException {
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
	public void afterScenario(Scenario scenario) {
		if (scenario.isFailed()) {
			failedCount++;
			ExtentReportManager.getTest().fail("❌ Scenario Failed: " + scenario.getName());
		} else {
			passedCount++;
			ExtentReportManager.getTest().pass("✅ Scenario Passed: " + scenario.getName());
		}

		ExtentReportManager.flushReport();
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
		String newFileName = nameWithoutExt + "-T-" + totalCount + "-P-" + passedCount + "-F-" + failedCount + ".html";
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
				e.printStackTrace();
			}
		}

		return new String[] { issuerSearchText, issuerSearchTextforSunbird };
	}

	public static Map<String, Integer> getWalletPasscodeSettings() throws Exception {
		// Construct actuator URL from existing 'url'
		String actuatorUrl = (url.endsWith("/") ? url.substring(0, url.length() - 1) : url).replace("injiweb", "api")
				+ "/v1/mimoto/actuator/env";

		HttpURLConnection conn = (HttpURLConnection) new URL(actuatorUrl).openConnection();
		conn.setRequestMethod("GET");
		conn.setRequestProperty("Accept", "application/json");

		if (conn.getResponseCode() != 200) {
			throw new RuntimeException("HTTP error: " + conn.getResponseCode());
		}

		StringBuilder response = new StringBuilder();
		try (BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
			String line;
			while ((line = in.readLine()) != null) {
				response.append(line);
			}
		}
		conn.disconnect();

		// Parse JSON
		JSONObject root = new JSONObject(response.toString());
		Map<String, Integer> result = new HashMap<>();

		// Loop through propertySources
		for (Object srcObj : root.getJSONArray("propertySources")) {
			JSONObject src = (JSONObject) srcObj;
			JSONObject props = src.optJSONObject("properties");
			if (props == null)
				continue;

			if (props.has("wallet.passcode.retryBlockedUntil") && !result.containsKey("retryBlockedUntil")) {
				result.put("retryBlockedUntil", Integer
						.parseInt(props.getJSONObject("wallet.passcode.retryBlockedUntil").optString("value", "0")));
			}
			if (props.has("wallet.passcode.maxFailedAttemptsAllowedPerCycle")
					&& !result.containsKey("maxFailedAttempts")) {
				result.put("maxFailedAttempts", Integer.parseInt(props
						.getJSONObject("wallet.passcode.maxFailedAttemptsAllowedPerCycle").optString("value", "0")));
			}
			if (props.has("wallet.passcode.maxLockCyclesAllowed") && !result.containsKey("maxLockCycles")) {
				result.put("maxLockCycles", Integer
						.parseInt(props.getJSONObject("wallet.passcode.maxLockCyclesAllowed").optString("value", "0")));
			}

			if (result.size() == 3)
				break;
		}

		return result;
	}

}