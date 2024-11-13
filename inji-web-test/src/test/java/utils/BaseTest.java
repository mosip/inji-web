package utils;

import io.cucumber.java.*;
import org.json.JSONObject;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.yaml.snakeyaml.Yaml;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

public class BaseTest {
    public void setDriver(WebDriver driver) {
        this.driver = driver;
    }
    public WebDriver driver;

    public String url ="https://injiweb.qa-inji.mosip.net/";

    public JavascriptExecutor jse;
    public String  PdfNameForMosip="MosipVerifiableCredential.pdf";
    public String  PdfNameForInsurance="InsuranceCredential.pdf";
    public String  PdfNameForLifeInsurance="InsuranceCredential.pdf";

    String accessKey = getKeyValueFromYaml("/browserstack.yml","accessKey");
    String userName = getKeyValueFromYaml("/browserstack.yml","userName");
    public  final String URL = "https://" + userName + ":" + accessKey + "@hub-cloud.browserstack.com/wd/hub";
    private Scenario scenario;
    @Before
    public void beforeAll() throws MalformedURLException {
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

    @After
    public void afterAll() {
        if (driver != null) {
            driver.quit();
        }
    }

    public WebDriver getDriver() {
        return driver;
    }

    public JavascriptExecutor getJse() {
        return jse;
    }

    public static String getKeyValueFromYaml(String filePath, String key) {
        FileReader reader = null;
        try {
            reader = new FileReader(System.getProperty("user.dir")+filePath);
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
        Yaml yaml = new Yaml();
        Object data = yaml.load(reader);

        if (data instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, String> map = (Map<String, String>) data;
            return (String) map.get(key);
        }  else {
            throw new RuntimeException("Invalid YAML format, expected a map");
        }
    }
}