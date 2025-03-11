package utils;

import com.aventstack.extentreports.MediaEntityBuilder;
import com.aventstack.extentreports.model.Media;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.apache.commons.io.FileUtils;
import java.io.File;
import java.io.IOException;
import utils.ExtentReportManager;

public class ScreenshotUtil  {

	public static String captureScreenshot(WebDriver driver, String screenshotName) throws IOException {
	    if (driver == null) {
	        System.err.println("WebDriver instance is null. Cannot take a screenshot.");
	        throw new IllegalStateException("WebDriver instance is null.");
	    }
	    TakesScreenshot ts = (TakesScreenshot) driver;
	    File source = ts.getScreenshotAs(OutputType.FILE);
	    
	    // Save the screenshot
	    String destinationPath = System.getProperty("user.dir") + "/screenshots/" + screenshotName + "_" + System.currentTimeMillis() + ".png";
	    File destination = new File(destinationPath);
	    destination.getParentFile().mkdirs();
	    FileUtils.copyFile(source, destination);

	    return destinationPath;
	}

    public static void attachScreenshot(WebDriver driver, String screenshotName) {
        try {
            String screenshotPath = captureScreenshot(driver, screenshotName);

            File screenshotFile = new File(screenshotPath);
            if (screenshotFile.exists()) {
                ExtentReportManager.getTest().info("Screenshot Captured", 
                    MediaEntityBuilder.createScreenCaptureFromPath(screenshotPath).build());
            } else {
                ExtentReportManager.getTest().warning("Screenshot file not found: " + screenshotPath);
            }
        } catch (IOException e) {
            ExtentReportManager.getTest().warning("Failed to attach screenshot to report: " + e.getMessage());
        }
    }
}

