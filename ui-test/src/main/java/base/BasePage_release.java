package base;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.yaml.snakeyaml.Yaml;

import io.restassured.RestAssured;
import utils.BaseTest;

public class BasePage {

    /* ====================== Robust Mobile/Desktop-safe Scrolling ====================== */
//    public static void safeScrollIfNeeded(WebDriver driver, By locator) {
//        int maxAttempts = 5;
//        int attempt = 0;
//
//        while (attempt < maxAttempts) {
//            try {
//                WebElement element = driver.findElement(locator);
//
//                // Check if element is in viewport using JS
//                Boolean inViewport = (Boolean) ((JavascriptExecutor) driver).executeScript(
//                        "var elem = arguments[0];" +
//                        "var rect = elem.getBoundingClientRect();" +
//                        "return (" +
//                        "rect.top >= 0 && rect.left >= 0 && " +
//                        "rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && " +
//                        "rect.right <= (window.innerWidth || document.documentElement.clientWidth)" +
//                        ");", element);
//
//                if (inViewport) {
//                    return; // Already visible
//                }
//
//                // Scroll element into center view
//                ((JavascriptExecutor) driver).executeScript(
//                        "arguments[0].scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'});", element);
//
//                // Scroll parent containers if needed
//                ((JavascriptExecutor) driver).executeScript(
//                        "var el = arguments[0];" +
//                        "while(el.parentElement) {" +
//                        "  el = el.parentElement;" +
//                        "  if(el.scrollHeight > el.clientHeight) {" +
//                        "    el.scrollTop = Math.min(el.scrollTop + 100, el.scrollHeight);" +
//                        "  }" +
//                        "}", element);
//
//                Thread.sleep(500); // wait for animation
//
//                // Verify again
//                inViewport = (Boolean) ((JavascriptExecutor) driver).executeScript(
//                        "var elem = arguments[0];" +
//                        "var rect = elem.getBoundingClientRect();" +
//                        "return (" +
//                        "rect.top >= 0 && rect.left >= 0 && " +
//                        "rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && " +
//                        "rect.right <= (window.innerWidth || document.documentElement.clientWidth)" +
//                        ");", element);
//
//                if (inViewport) {
//                    return; // Successfully scrolled
//                }
//
//            } catch (NoSuchElementException e) {
//                System.out.println("Attempt " + (attempt + 1) + ": Element not found yet. Retrying...");
//            } catch (TimeoutException e) {
//                System.out.println("Attempt " + (attempt + 1) + ": Element not visible after scroll. Retrying...");
//            } catch (StaleElementReferenceException e) {
//                System.out.println("Attempt " + (attempt + 1) + ": Element became stale. Retrying...");
//            } catch (Exception e) {
//                System.out.println("Attempt " + (attempt + 1) + ": Unexpected error: " + e.getMessage());
//            }
//
//            attempt++;
//
//            try {
//                Thread.sleep(500); // small pause before next scroll attempt
//            } catch (InterruptedException ignored) {}
//        }
//
//        System.out.println("Warning: Element " + locator + " not visible after " + maxAttempts + " attempts.");
//    }
	
	
	
	
	public static void safeScrollIfNeeded(WebDriver driver, By locator) {
	    int maxAttempts = 5;
	    int attempt = 0;

	    while (attempt < maxAttempts) {
	        try {
	            WebElement element = driver.findElement(locator);

	            // Check if at least part of element is in viewport (not strict full fit)
	            Boolean partiallyInViewport = (Boolean) ((JavascriptExecutor) driver).executeScript(
	                    "var elem = arguments[0];" +
	                    "var rect = elem.getBoundingClientRect();" +
	                    "return (" +
	                    "rect.bottom > 0 && rect.right > 0 && " +
	                    "rect.top < (window.innerHeight || document.documentElement.clientHeight) && " +
	                    "rect.left < (window.innerWidth || document.documentElement.clientWidth)" +
	                    ");", element);

	            if (partiallyInViewport) {
	                return; // Already at least partially visible
	            }

	            // Scroll into center of viewport (instant, no smooth animation)
	            ((JavascriptExecutor) driver).executeScript(
	                    "arguments[0].scrollIntoView({behavior: 'instant', block: 'center', inline: 'center'});",
	                    element);

	            // Additional parent scrolling if needed (jump bigger each attempt)
	            ((JavascriptExecutor) driver).executeScript(
	                    "var el = arguments[0];" +
	                    "while(el && el.parentElement) {" +
	                    "  el = el.parentElement;" +
	                    "  if(el.scrollHeight > el.clientHeight) {" +
	                    "    el.scrollTop = el.scrollTop + 200;" +
	                    "  }" +
	                    "}", element);

	            Thread.sleep(300); // small pause

	        } catch (NoSuchElementException e) {
	            System.out.println("Attempt " + (attempt + 1) + ": Element not found. Retrying...");
	        } catch (StaleElementReferenceException e) {
	            System.out.println("Attempt " + (attempt + 1) + ": Element stale. Retrying...");
	        } catch (Exception e) {
	            System.out.println("Attempt " + (attempt + 1) + ": Unexpected error: " + e.getMessage());
	        }

	        attempt++;
	    }

	    System.out.println("⚠️ Warning: Element " + locator + " not visible after " + maxAttempts + " attempts.");
	}


    /* ====================== Element Actions ====================== */
    public void clickOnElement(WebDriver driver, By locator) {
        WebElement element = new WebDriverWait(driver, Duration.ofSeconds(30))
                .until(ExpectedConditions.presenceOfElementLocated(locator));
        safeScrollIfNeeded(driver, locator);
        element.click();
    }

    public static boolean isElementIsVisible(WebDriver driver, By by) {
        try {
            new WebDriverWait(driver, Duration.ofSeconds(30))
                    .until(ExpectedConditions.visibilityOfElementLocated(by));
            safeScrollIfNeeded(driver, by);
            return driver.findElement(by).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public static boolean isElementIsVisible(WebDriver driver, By by, int timeoutInSeconds) {
        try {
            new WebDriverWait(driver, Duration.ofSeconds(timeoutInSeconds))
                    .until(ExpectedConditions.visibilityOfElementLocated(by));
            safeScrollIfNeeded(driver, by);
            return driver.findElement(by).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public static void clickOnElement(WebDriver driver, By locator, int timeoutInSeconds) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(timeoutInSeconds));
            WebElement element = wait.until(ExpectedConditions.elementToBeClickable(locator));
            safeScrollIfNeeded(driver, locator);
            element.click();
        } catch (Exception e) {
            throw new RuntimeException("Failed to click on element: " + locator, e);
        }
    }

    public static boolean isElementNotVisible(WebDriver driver, By by) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
            return wait.until(ExpectedConditions.invisibilityOfElementLocated(by));
        } catch (Exception e) {
            try {
                safeScrollIfNeeded(driver, by);
                WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
                return wait.until(ExpectedConditions.invisibilityOfElementLocated(by));
            } catch (Exception ex) {
                return true;
            }
        }
    }

    public void enterText(WebDriver driver, By locator, String text) {
        WebElement element = new WebDriverWait(driver, Duration.ofSeconds(30))
                .until(ExpectedConditions.presenceOfElementLocated(locator));
        safeScrollIfNeeded(driver, locator);
        element.clear();
        element.sendKeys(text);
    }

    public String getElementText(WebDriver driver, By locator) {
        WebElement element = new WebDriverWait(driver, Duration.ofSeconds(30))
                .until(ExpectedConditions.presenceOfElementLocated(locator));
        safeScrollIfNeeded(driver, locator);
        return element.getText();
    }

    public List<String> getElementTexts(WebDriver driver, By locator) throws TimeoutException {
        List<String> textContents = new ArrayList<>();
        List<WebElement> elements = new WebDriverWait(driver, Duration.ofSeconds(30))
                .until(ExpectedConditions.presenceOfAllElementsLocatedBy(locator));
        for (WebElement element : elements) {
            safeScrollIfNeeded(driver, locator);
            textContents.add(element.getText());
        }
        return textContents;
    }

    public static boolean isElementEnabled(WebDriver driver, By by) {
        try {
            new WebDriverWait(driver, Duration.ofSeconds(10))
                    .until(ExpectedConditions.visibilityOfElementLocated(by));
            safeScrollIfNeeded(driver, by);
            return driver.findElement(by).isEnabled();
        } catch (Exception e) {
            return false;
        }
    }

    public String getElementAttribute(WebDriver driver, By locator, String data) {
        WebElement element = new WebDriverWait(driver, Duration.ofSeconds(30))
                .until(ExpectedConditions.presenceOfElementLocated(locator));
        safeScrollIfNeeded(driver, locator);
        return element.getAttribute(data);
    }

    /* ====================== YAML Utils ====================== */
    public static String getKeyValueFromYaml(String filePath, String key) {
        try (FileReader reader = new FileReader(System.getProperty("user.dir") + filePath)) {
            Yaml yaml = new Yaml();
            Object data = yaml.load(reader);
            if (data instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, String> map = (Map<String, String>) data;
                return map.get(key);
            } else {
                throw new RuntimeException("Invalid YAML format, expected a map");
            }
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        } catch (Exception e) {
            throw new RuntimeException("Failed to read YAML", e);
        }
    }

    /* ====================== BrowserStack Network Utils ====================== */
    public static void resetNetworkProfile(String sessionID) {
        String baseURL = "https://api-cloud.browserstack.com";
        String endpoint = "/app-automate/sessions/" + sessionID + "/update_network.json";

        String accessKey = getKeyValueFromYaml("/browserstack.yml", "accessKey");
        String userName = getKeyValueFromYaml("/browserstack.yml", "userName");
        String networkSettingsJson = "{\"networkProfile\":\"reset\"}";

        RestAssured.given().auth().basic(userName, accessKey)
                .header("Content-Type", "application/json")
                .body(networkSettingsJson)
                .put(baseURL + endpoint);
    }

    public static void setNoNetworkProfile(String sessionID) {
        String baseURL = "https://api-cloud.browserstack.com";
        String endpoint = "/app-automate/sessions/" + sessionID + "/update_network.json";

        String accessKey = getKeyValueFromYaml("/browserstack.yml", "accessKey");
        String userName = getKeyValueFromYaml("/browserstack.yml", "userName");
        String networkSettingsJson = "{\"networkProfile\":\"no-network\"}";

        RestAssured.given().auth().basic(userName, accessKey)
                .header("Content-Type", "application/json")
                .body(networkSettingsJson)
                .put(baseURL + endpoint);
    }

    /* ====================== Waits ====================== */
    public String waitForUrlContains(WebDriver driver, String partialUrl, int timeoutInSeconds) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(timeoutInSeconds));
            wait.until(ExpectedConditions.urlContains(partialUrl));
            return driver.getCurrentUrl();
        } catch (TimeoutException e) {
            throw new AssertionError("Timed out waiting for URL to contain: " + partialUrl, e);
        }
    }

    public static void waitForSeconds(WebDriver driver, int seconds) {
        Instant startTime = Instant.now();
        new WebDriverWait(driver, Duration.ofSeconds(seconds + 1))
                .until(d -> Duration.between(startTime, Instant.now()).getSeconds() >= seconds);
    }

    public void waitUntilElementEnabled(WebDriver driver, By locator, int timeoutSeconds) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(timeoutSeconds));
        wait.until(ExpectedConditions.elementToBeClickable(locator));
    }
    
    public int getXCordinateValue(WebDriver driver, By locator) {
        WebElement element = new WebDriverWait(driver, Duration.ofSeconds(30))
                .until(ExpectedConditions.presenceOfElementLocated(locator));
        return element.getLocation().getX();

    }
    
}
