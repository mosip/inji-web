package utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.Date;
import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.reporter.ExtentHtmlReporter;
import com.aventstack.extentreports.reporter.configuration.Theme;

public class ExtentReportManager {
	private static ExtentReports extent;
	private static ExtentTest test;

	public static String currentReportFileName;
	private static String timestamp;

	public static void initReport() {
		if (extent == null) {
			String envUrl = BaseTest.url;
			if (envUrl.endsWith("/")) {
				envUrl = envUrl.substring(0, envUrl.length() - 1);
			}
			timestamp = new SimpleDateFormat("yyyy-MM-dd-HH-mm").format(new Date());
			String domainOnly = envUrl.replaceFirst("https?://", "");
			String formattedEnvName = "InjiWebUi-" + domainOnly;
			currentReportFileName = formattedEnvName + "-" + timestamp + ".html";
			ExtentHtmlReporter htmlReporter = new ExtentHtmlReporter("test-output/" + currentReportFileName);
			htmlReporter.config().setTheme(Theme.DARK);
			htmlReporter.config().setDocumentTitle("Automation Report");
			htmlReporter.config().setReportName(formattedEnvName);
			extent = new ExtentReports();
			extent.attachReporter(htmlReporter);
			addSystemInfo(envUrl, timestamp);
		}
	}

	public static String getCurrentReportFileName() {
		return currentReportFileName;
	}

	private static void addSystemInfo(String envUrl, String timestamp) {
		String branch = getGitBranch();
		if (branch == null || branch.trim().isEmpty()) {
			branch = System.getenv("BRANCH_NAME");
		}

		String commitId = getGitCommitId();
		if (commitId == null || commitId.trim().isEmpty()) {
			commitId = System.getenv("COMMIT_ID");
		}

		String testUrl = System.getenv("TEST_URL");
		if (testUrl == null || testUrl.trim().isEmpty()) {
			testUrl = envUrl;
		}

		if (extent != null) {
			extent.setSystemInfo("Git Branch", branch != null ? branch : "N/A");
			extent.setSystemInfo("Commit ID", commitId != null ? commitId : "N/A");
			extent.setSystemInfo("TEST_URL", testUrl);
			extent.setSystemInfo("Execution Time", timestamp);
		}
	}

	private static String getGitBranch() {
		try {
			Process process = Runtime.getRuntime().exec("git rev-parse --abbrev-ref HEAD");
			BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
			return reader.readLine();
		} catch (IOException | NullPointerException e) {
			System.err.println("Failed to get Git branch: " + e.getMessage());
			return null;
		}
	}

	private static String getGitCommitId() {
		try {
			Process process = Runtime.getRuntime().exec("git rev-parse HEAD");
			BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
			return reader.readLine();
		} catch (IOException | NullPointerException e) {
			System.err.println("Failed to get Git commit ID: " + e.getMessage());
			return null;
		}
	}

	public static void createTest(String testName) {
		test = extent.createTest(testName);
	}

	public static void logStep(String message) {
		if (test != null) {
			test.info(message);
		}
	}

	public static void flushReport() {
		if (extent != null) {
			extent.flush();
		}
	}

	public static ExtentTest getTest() {
		return test;
	}
}
