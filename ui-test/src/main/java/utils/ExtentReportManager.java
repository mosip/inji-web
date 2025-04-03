package utils;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.reporter.ExtentHtmlReporter;
import com.aventstack.extentreports.reporter.configuration.Theme;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class ExtentReportManager {
    private static ExtentReports extent;
    private static ExtentTest test;

    public static void initReport() {
        if (extent == null) {
            String branch = getGitBranch();
            String commitId = getGitCommitId();
            String reportName = "Test Execution Report";

            if (branch != null && commitId != null) {
                reportName += " - Branch: " + branch + ", Commit: " + commitId.substring(0, 7);
            } else if (branch != null){
                reportName += " - Branch: " + branch;
            } else if (commitId != null){
                reportName += " - Commit: " + commitId.substring(0, 7);
            }

            ExtentHtmlReporter htmlReporter = new ExtentHtmlReporter("test-output/ExtentReport.html");
            htmlReporter.config().setTheme(Theme.DARK);
            htmlReporter.config().setDocumentTitle("Automation Report");
            htmlReporter.config().setReportName(reportName);

            extent = new ExtentReports();
            extent.attachReporter(htmlReporter);
            addSystemInfo();
        }
    }

    private static void addSystemInfo() {
        String branch = getGitBranch();
        String commitId = getGitCommitId();

        if (extent != null) {
            if (branch != null) {
                extent.setSystemInfo("Git Branch", branch);
            }
            if (commitId != null) {
                extent.setSystemInfo("Git Commit ID", commitId);
            }
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