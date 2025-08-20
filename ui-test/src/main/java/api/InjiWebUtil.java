package api;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

import javax.ws.rs.core.MediaType;

import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.testng.SkipException;

import com.github.javafaker.Faker;

import io.mosip.testrig.apirig.dto.TestCaseDTO;
import io.mosip.testrig.apirig.utils.AdminTestUtil;
import io.mosip.testrig.apirig.utils.ConfigManager;
import io.mosip.testrig.apirig.utils.GlobalConstants;
import io.mosip.testrig.apirig.utils.RestClient;
import io.mosip.testrig.apirig.utils.SkipTestCaseHandler;
import io.restassured.response.Response;

public class InjiWebUtil extends AdminTestUtil {

	private static final Logger logger = Logger.getLogger(InjiWebUtil.class);
	private static String otpEnabled = "true";
	private static Faker faker = new Faker();
	private static String fullNameForSunBirdR = generateFullNameForSunBirdR();
	private static String dobForSunBirdR = generateDobForSunBirdR();
	private static String policyNumberForSunBirdR = generateRandomNumberString(9);
	
	public static void setLogLevel() {
		if (InjiWebConfigManager.IsDebugEnabled())
			logger.setLevel(Level.ALL);
		else
			logger.setLevel(Level.ERROR);
	}

	public static TestCaseDTO isTestCaseValidForTheExecution(TestCaseDTO testCaseDTO) {
		String testCaseName = testCaseDTO.getTestCaseName();
		
		int indexof = testCaseName.indexOf("_");
		String modifiedTestCaseName = testCaseName.substring(indexof + 1);
		
		addTestCaseDetailsToMap(modifiedTestCaseName, testCaseDTO.getUniqueIdentifier());
		
		
		String endpoint = testCaseDTO.getEndPoint();
		String inputJson = testCaseDTO.getInput();

		
		if (SkipTestCaseHandler.isTestCaseInSkippedList(testCaseName)) {
			throw new SkipException(GlobalConstants.KNOWN_ISSUES);
		}
		return testCaseDTO;
	}
	

	
	public static String inputstringKeyWordHandeler(String jsonString, String testCaseName) {

		if (jsonString.contains(GlobalConstants.TIMESTAMP)) {
			jsonString = replaceKeywordWithValue(jsonString, GlobalConstants.TIMESTAMP, generateCurrentUTCTimeStamp());
		}
//
		if (jsonString.contains("$POLICYNUMBERFORSUNBIRDRC$")) {
			jsonString = replaceKeywordWithValue(jsonString, "$POLICYNUMBERFORSUNBIRDRC$", policyNumberForSunBirdR);
		}

		if (jsonString.contains("$FULLNAMEFORSUNBIRDRC$")) {
			jsonString = replaceKeywordWithValue(jsonString, "$FULLNAMEFORSUNBIRDRC$", fullNameForSunBirdR);
		}

		if (jsonString.contains("$DOBFORSUNBIRDRC$")) {
			jsonString = replaceKeywordWithValue(jsonString, "$DOBFORSUNBIRDRC$", dobForSunBirdR);
		}

		return jsonString;

	}
	


	public static String generateFullNameForSunBirdR() {
		return faker.name().fullName();
	}

	public static String generateDobForSunBirdR() {
		Faker faker = new Faker();
		LocalDate dob = faker.date().birthday().toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDate();
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
		return dob.format(formatter);
	}
	
	public static JSONArray mimotoActuatorResponseArray = null;

	public static String getValueFromMimotoActuator(String section, String key) {
		String url = ApplnURI + ConfigManager.getproperty("actuatorMimotoEndpoint");
		if (!(System.getenv("useOldContextURL") == null)
				&& !(System.getenv("useOldContextURL").isBlank())
				&& System.getenv("useOldContextURL").equalsIgnoreCase("true")) {
			if (url.contains("/v1/mimoto/")) {
				url = url.replace("/v1/mimoto/", "/residentmobileapp/");
			}
		}
		String actuatorCacheKey = url + section + key;
		String value = actuatorValueCache.get(actuatorCacheKey);
		if (value != null && !value.isEmpty())
			return value;

		try {
			if (mimotoActuatorResponseArray == null) {
				Response response = null;
				JSONObject responseJson = null;
				response = RestClient.getRequest(url, MediaType.APPLICATION_JSON, MediaType.APPLICATION_JSON);

				responseJson = new JSONObject(response.getBody().asString());
				mimotoActuatorResponseArray = responseJson.getJSONArray("propertySources");
			}
			for (int i = 0, size = mimotoActuatorResponseArray.length(); i < size; i++) {
				JSONObject eachJson = mimotoActuatorResponseArray.getJSONObject(i);
				if (eachJson.get("name").toString().contains(section)) {
					value = eachJson.getJSONObject(GlobalConstants.PROPERTIES).getJSONObject(key)
							.get(GlobalConstants.VALUE).toString();
					if (ConfigManager.IsDebugEnabled())
//						logger.info("Actuator: " + url + " key: " + key + " value: " + value);
					break;
				}
			}
			actuatorValueCache.put(actuatorCacheKey, value);

			return value;
		} catch (Exception e) {

			return "";
		}

	}

	public static String getSunbirdBaseURL() {
		return InjiWebUtil.getValueFromMimotoActuator("overrides", "mosip.sunbird.url");
	}

	public static TestCaseDTO changeContextURLByFlag(TestCaseDTO testCaseDTO) {
		if (!(System.getenv("useOldContextURL") == null) && !(System.getenv("useOldContextURL").isBlank())
				&& System.getenv("useOldContextURL").equalsIgnoreCase("true")) {
			if (testCaseDTO.getEndPoint().contains("/v1/mimoto/")) {
				testCaseDTO.setEndPoint(testCaseDTO.getEndPoint().replace("/v1/mimoto/", "/residentmobileapp/"));
			}
			if (testCaseDTO.getInput().contains("/v1/mimoto/")) {
				testCaseDTO.setInput(testCaseDTO.getInput().replace("/v1/mimoto/", "/residentmobileapp/"));
			}
		}

		return testCaseDTO;
	}
	
	public static String getCredentialConfigKey(String wellKnownUrl) {
	    try {
	        // Use RestClient from your existing utility
	        Response response = RestClient.getRequest(wellKnownUrl, MediaType.APPLICATION_JSON, MediaType.APPLICATION_JSON);
	        JSONObject json = new JSONObject(response.getBody().asString());
	        return json.getJSONObject("credential_configurations_supported").keys().next();
	    } catch (Exception e) {
	        e.printStackTrace();
	        return "default";
	    }
	}
	
    public static HashMap<String, Integer> getActuatorValues(HashMap<String, String> keyMapping) throws Exception {
    	
    	String url = System.getenv("TEST_URL") != null && !System.getenv("TEST_URL").isEmpty()
    			? System.getenv("TEST_URL")
    			: InjiWebConfigManager.getproperty("injiWebUi");
    	
        // Construct actuator URL
        String actuatorUrl = (url.endsWith("/") ? url.substring(0, url.length() - 1) : url)
                .replace("injiweb", "api") + "/v1/mimoto/actuator/env";

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

        JSONObject root = new JSONObject(response.toString());
        HashMap<String, Integer> result = new HashMap<>();

        for (Object srcObj : root.getJSONArray("propertySources")) {
            JSONObject src = (JSONObject) srcObj;
            JSONObject props = src.optJSONObject("properties");
            if (props == null) continue;

            for (String actuatorKey : keyMapping.keySet()) {
                String resultKey = keyMapping.get(actuatorKey);
                if (!result.containsKey(resultKey) && props.has(actuatorKey)) {
                    result.put(resultKey, Integer.parseInt(props.getJSONObject(actuatorKey).optString("value", "0")));
                }
            }

            if (result.size() == keyMapping.size()) break;
        }

        return result;
    }

}
