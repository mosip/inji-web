package base;

import io.restassured.RestAssured;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.yaml.snakeyaml.Yaml;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class BasePage {

	public void clickOnElement(WebDriver driver, By locator) {
		WebElement element = new WebDriverWait(driver, Duration.ofSeconds(30))
				.until(ExpectedConditions.presenceOfElementLocated(locator));
		element.click();
	}

	public static boolean isElementIsVisible(WebDriver driver, By by) {
		try {
			(new WebDriverWait(driver, Duration.ofSeconds(30)))
					.until(ExpectedConditions.visibilityOfElementLocated(by));
			return driver.findElement(by).isDisplayed();
		} catch (Exception e) {
			return false;
		}
	}

	public static boolean isElementNotVisible(WebDriver driver, By by) {
		try {
			WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
			return wait.until(ExpectedConditions.invisibilityOfElementLocated(by));
		} catch (Exception e) {
			return true; // Treat errors as "not visible"
		}
	}

	public void enterText(WebDriver driver, By locator, String text) {
		WebElement element = new WebDriverWait(driver, Duration.ofSeconds(30))
				.until(ExpectedConditions.presenceOfElementLocated(locator));
		element.clear();
		element.sendKeys(text);
	}

	public String getElementText(WebDriver driver, By locator) {
		WebElement element = new WebDriverWait(driver, Duration.ofSeconds(30))
				.until(ExpectedConditions.presenceOfElementLocated(locator));
		return element.getText();
	}

	public List<String> getElementTexts(WebDriver driver, By locator) throws TimeoutException {
		List<String> textContents = new ArrayList<>();
		List<WebElement> elements = new WebDriverWait(driver, Duration.ofSeconds(30))
				.until(ExpectedConditions.presenceOfAllElementsLocatedBy(locator));
		for (WebElement element : elements) {
			textContents.add(element.getText());
		}
		return textContents;
	}

	public static String getKeyValueFromYaml(String filePath, String key) {
		FileReader reader = null;
		try {
			reader = new FileReader(System.getProperty("user.dir") + filePath);
		} catch (FileNotFoundException e) {
			throw new RuntimeException(e);
		}
		Yaml yaml = new Yaml();
		Object data = yaml.load(reader);

		if (data instanceof Map) {
			@SuppressWarnings("unchecked")
			Map<String, String> map = (Map<String, String>) data;
			return (String) map.get(key);
		} else {
			throw new RuntimeException("Invalid YAML format, expected a map");
		}
	}

	public static void resetNetworkProfile(String sessionID) {
		String baseURL = "https://api-cloud.browserstack.com";
		String endpoint = "/app-automate/sessions/" + sessionID + "/update_network.json";

		String accessKey = getKeyValueFromYaml("/browserstack.yml", "accessKey");
		String userName = getKeyValueFromYaml("/browserstack.yml", "userName");
		String networkSettingsJson = "{\"networkProfile\":\"reset\"}";

		RequestSpecification requestSpec = RestAssured.given().auth().basic(userName, accessKey)
				.header("Content-Type", "application/json").body(networkSettingsJson);

		Response response = requestSpec.put(baseURL + endpoint);
	}

	public static void setNoNetworkProfile(String sessionID) {
		String baseURL = "https://api-cloud.browserstack.com";
		String endpoint = "/app-automate/sessions/" + sessionID + "/update_network.json";
		String accessKey = getKeyValueFromYaml("/browserstack.yml", "accessKey");
		String userName = getKeyValueFromYaml("/browserstack.yml", "userName");
		String networkSettingsJson = "{\"networkProfile\":\"no-network\"}";
		RequestSpecification requestSpec = RestAssured.given().auth().basic(userName, accessKey)
				.header("Content-Type", "application/json").body(networkSettingsJson);
		Response response = requestSpec.put(baseURL + endpoint);
	}

	public static boolean isElementEnabled(WebDriver driver, By by) {
		try {
			(new WebDriverWait(driver, Duration.ofSeconds(10)))
					.until(ExpectedConditions.visibilityOfElementLocated(by));
			return driver.findElement(by).isEnabled();
		} catch (Exception e) {
			return false;
		}
	}

	public String waitForUrlContains(WebDriver driver, String partialUrl, int timeoutInSeconds) {
		try {
			WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(timeoutInSeconds));
			wait.until(ExpectedConditions.urlContains(partialUrl));
			return driver.getCurrentUrl();
		} catch (TimeoutException e) {
			throw new AssertionError("Timed out waiting for URL to contain: " + partialUrl, e);
		}
	}
	
	public void waitForSeconds(WebDriver driver,int seconds) {
	    new WebDriverWait(driver, Duration.ofSeconds(seconds))
	        .until(webDriver -> true); 
	}
	
}
