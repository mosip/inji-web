package utils;

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;

import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.restassured.RestAssured;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import org.json.JSONObject;
import org.testng.ITestResult;
import org.yaml.snakeyaml.Yaml;
import io.cucumber.java.Scenario;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.file.Files;
import java.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;


public class BaseTest{

	public static String userName, accessKey;
	public static Map<String, Object> browserStackYamlMap;
	public static final String USER_DIR = "user.dir";
	BrowserContext context;

	public static Playwright playwright;
	public static Browser browser;
	public Page page;
	DriverManager driver;

	public BaseTest(DriverManager driver) {
		this.driver = driver;
		File file = new File(getUserDir() + "/browserstack.yml");
		browserStackYamlMap = convertYamlFileToMap(file, new HashMap<>());
	}

	@Before
	public void setup() {

		playwright = Playwright.create();
		BrowserType browserType = playwright.chromium();
		String caps = null;
		userName = System.getenv("BROWSERSTACK_USERNAME") != null ? System.getenv("BROWSERSTACK_USERNAME") : (String) browserStackYamlMap.get("userName");
		accessKey = System.getenv("BROWSERSTACK_ACCESS_KEY") != null ? System.getenv("BROWSERSTACK_ACCESS_KEY") : (String) browserStackYamlMap.get("accessKey");

		HashMap<String, String> capabilitiesObject = new HashMap<>();
		capabilitiesObject.put("browserstack.user", userName);
		capabilitiesObject.put("browserstack.key", accessKey);
		capabilitiesObject.put("browserstack.source", "java-playwright-browserstack:sample-sdk:v1.0");
		capabilitiesObject.put("browser", "chrome");

		JSONObject jsonCaps = new JSONObject(capabilitiesObject);
		try {
			caps = URLEncoder.encode(jsonCaps.toString(), "utf-8");
		} catch (UnsupportedEncodingException e) {
			throw new RuntimeException(e);
		}
		String wsEndpoint = "wss://cdp.browserstack.com/playwright?caps=" + caps;
		browser = browserType.connect(wsEndpoint);
		page = browser.newPage();
		driver.setPage(page);
		page.navigate("https://inji.qa-inji.mosip.net/");
	}

	@After
	public void tearDown(Scenario scenario) {

		setTestcaseName(scenario);

		if (scenario.isFailed()) {
			setStatusFailed();
			System.out.println("Scenario failed: " + scenario.getName());
		} else {
			setStatusPass();
			System.out.println("Scenario passed: " + scenario.getName());
		}
			browser.close();
			page.close();
	}



	private String getUserDir() {
		return System.getProperty(USER_DIR);
	}

	private Map<String, Object> convertYamlFileToMap(File yamlFile, Map<String, Object> map) {
		try {
			InputStream inputStream = Files.newInputStream(yamlFile.toPath());
			Yaml yaml = new Yaml();
			Map<String, Object> config = yaml.load(inputStream);
			map.putAll(config);
		} catch (Exception e) {
			throw new RuntimeException(String.format("Malformed browserstack.yml file - %s.", e));
		}
		return map;
	}

	public String getSessionId(){
		String script = "browserstack_executor: " + new Gson().toJson(Collections.singletonMap("action", "getSessionDetails"));
		String jsonResponse = page.evaluate("() => JSON.parse(arguments[0])", script).toString();

		// Parse the JSON response
		Gson gson = new Gson();
		Map<String, Object> resp = gson.fromJson(jsonResponse, Map.class);

		// Print the response
		System.out.println(resp);

		String hashedId = (String) resp.get("hashed_id");
		System.out.println("hashed_id: " + hashedId);

		return hashedId ;
	}

	public void setStatusPass(){
		String sessionId = getSessionId();
		String accessKey=  getKeyValueFromYaml("/browserstack.yml","accessKey");
		String userName =  getKeyValueFromYaml("/browserstack.yml","userName");

		String endpoint = "https://api.browserstack.com/automate/sessions/"+ sessionId +".json";
		String updateStatus = "{\"status\":\"passed\"}";

		RequestSpecification requestSpec = RestAssured.given()
				.auth().basic(userName, accessKey)
				.header("Content-Type", "application/json")
				.body(updateStatus);

		Response response = requestSpec.put( endpoint);
		System.out.println(response);
	}

	public void setTestcaseName(Scenario scenario){
		String scenarioName=scenario.getName();
		String sessionId = getSessionId();
		String accessKey=  getKeyValueFromYaml("/browserstack.yml","accessKey");
		String userName =  getKeyValueFromYaml("/browserstack.yml","userName");

		String endpoint = "https://api.browserstack.com/automate/sessions/"+ sessionId +".json";
		String updateStatus = "{\"name\":"+scenarioName+"}";

		RequestSpecification requestSpec = RestAssured.given()
				.auth().basic(userName, accessKey)
				.header("Content-Type", "application/json")
				.body(updateStatus);

		Response response = requestSpec.put( endpoint);
		System.out.println(response);
	}

	public void setStatusFailed(){
		String sessionId = getSessionId();

		String accessKey=  getKeyValueFromYaml("/browserstack.yml","accessKey");
		String userName =  getKeyValueFromYaml("/browserstack.yml","userName");

		String endpoint = "https://api.browserstack.com/automate/sessions/"+ sessionId +".json";
		String updateStatus = "{\"status\":\"failed\"}";

		RequestSpecification requestSpec = RestAssured.given()
				.auth().basic(userName, accessKey)
				.header("Content-Type", "application/json")
				.body(updateStatus);

		Response response = requestSpec.put( endpoint);
		System.out.println(response);
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
