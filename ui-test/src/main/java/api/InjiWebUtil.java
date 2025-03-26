package api;

import com.github.javafaker.Faker;
import io.mosip.testrig.apirig.dto.TestCaseDTO;
import io.mosip.testrig.apirig.utils.*;
import io.restassured.response.Response;

import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.testng.SkipException;

import javax.ws.rs.core.MediaType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

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

//	public static String isOTPEnabled() {
//		String value = getValueFromMimotoActuator("/mimoto-default.properties", "mosip.otp.download.enable").isBlank()
//				? System.getenv("isOTPEnabled")
//				: getValueFromMimotoActuator("/mimoto-default.properties", "mosip.otp.download.enable");
//		if (value != null && !(value.isBlank()))
//			otpEnabled = value;
//		logger.info("OTP Enabled value: " + otpEnabled);
//		return otpEnabled;
//	}
	
//	public static TestCaseDTO changeContextURLByFlag(TestCaseDTO testCaseDTO) {
//		if (!(System.getenv("useOldContextURL") == null) && !(System.getenv("useOldContextURL").isBlank())
//				&& System.getenv("useOldContextURL").equalsIgnoreCase("true")) {
//			if (testCaseDTO.getEndPoint().contains("/v1/mimoto/")) {
//				testCaseDTO.setEndPoint(testCaseDTO.getEndPoint().replace("/v1/mimoto/", "/residentmobileapp/"));
//			}
//			if (testCaseDTO.getInput().contains("/v1/mimoto/")) {
//				testCaseDTO.setInput(testCaseDTO.getInput().replace("/v1/mimoto/", "/residentmobileapp/"));
//			}
//		}
//
//		return testCaseDTO;
//	}
	
	public static TestCaseDTO isTestCaseValidForTheExecution(TestCaseDTO testCaseDTO) {
		String testCaseName = testCaseDTO.getTestCaseName();
		
		int indexof = testCaseName.indexOf("_");
		String modifiedTestCaseName = testCaseName.substring(indexof + 1);
		
		addTestCaseDetailsToMap(modifiedTestCaseName, testCaseDTO.getUniqueIdentifier());
		
		
		String endpoint = testCaseDTO.getEndPoint();
		String inputJson = testCaseDTO.getInput();
		
//		if (MosipTestRunner.skipAll == true) {
//			throw new SkipException(GlobalConstants.PRE_REQUISITE_FAILED_MESSAGE);
//		}
		
//		if (isOTPEnabled().equals("false")) {
//			if (testCaseDTO.getEndPoint().contains(GlobalConstants.SEND_OTP_ENDPOINT)
//					|| testCaseDTO.getInput().contains(GlobalConstants.SEND_OTP_ENDPOINT)
//					|| testCaseName.startsWith(GlobalConstants.MIMOTO_CREDENTIAL_STATUS)
//					|| (testCaseName.startsWith("Mimoto_Generate_") && endpoint.contains("/v1/mimoto/vid"))) {
//				throw new SkipException(GlobalConstants.OTP_FEATURE_NOT_SUPPORTED);
//			}
//
//			if (inputJson.contains("_vid$")) {
//				inputJson = inputJson.replace("_vid$", "_VID$");
//				testCaseDTO.setInput(inputJson);
//			}
//		}
//		if (isOTPEnabled().equals("true") && endpoint.contains("/idrepository/v1/vid")) {
//			throw new SkipException(GlobalConstants.FEATURE_NOT_SUPPORTED_MESSAGE);
//		}
		
		if (SkipTestCaseHandler.isTestCaseInSkippedList(testCaseName)) {
			throw new SkipException(GlobalConstants.KNOWN_ISSUES);
		}
		return testCaseDTO;
	}
	
//	public static String getOTPFromSMTP(String inputJson, TestCaseDTO testCaseDTO) throws JSONException {
//		String testCaseName = testCaseDTO.getTestCaseName();
//		JSONObject request = new JSONObject(inputJson);
//		String emailId = null;
//		String otp = null;
//
//		if (testCaseName.contains("ESignet_AuthenticateUser") && request.has(GlobalConstants.REQUEST)) {
//			if (request.getJSONObject(GlobalConstants.REQUEST).has(GlobalConstants.CHALLENGELIST)) {
//				if (request.getJSONObject(GlobalConstants.REQUEST).getJSONArray(GlobalConstants.CHALLENGELIST)
//						.length() > 0) {
//					if (request.getJSONObject(GlobalConstants.REQUEST).getJSONArray(GlobalConstants.CHALLENGELIST)
//							.getJSONObject(0).has(GlobalConstants.CHALLENGE)) {
//						if (request.getJSONObject(GlobalConstants.REQUEST).getJSONArray(GlobalConstants.CHALLENGELIST)
//								.getJSONObject(0).getString(GlobalConstants.CHALLENGE)
//								.endsWith(GlobalConstants.MAILINATOR_COM)
//								|| request.getJSONObject(GlobalConstants.REQUEST)
//										.getJSONArray(GlobalConstants.CHALLENGELIST).getJSONObject(0)
//										.getString(GlobalConstants.CHALLENGE).endsWith(GlobalConstants.MOSIP_NET)
//								|| request.getJSONObject(GlobalConstants.REQUEST)
//										.getJSONArray(GlobalConstants.CHALLENGELIST).getJSONObject(0)
//										.getString(GlobalConstants.CHALLENGE).endsWith(GlobalConstants.OTP_AS_PHONE)) {
//							emailId = request.getJSONObject(GlobalConstants.REQUEST)
//									.getJSONArray(GlobalConstants.CHALLENGELIST).getJSONObject(0)
//									.getString(GlobalConstants.CHALLENGE);
//							if (emailId.endsWith(GlobalConstants.OTP_AS_PHONE)) {
//								emailId = emailId.replace(GlobalConstants.OTP_AS_PHONE, "");
//								emailId = removeLeadingPlusSigns(emailId);
//							}
//							logger.info(emailId);
//							otp = OTPListener.getOtp(emailId);
//							request.getJSONObject(GlobalConstants.REQUEST).getJSONArray(GlobalConstants.CHALLENGELIST)
//									.getJSONObject(0).put(GlobalConstants.CHALLENGE, otp);
//							inputJson = request.toString();
//							return inputJson;
//						}
//					}
//				}
//			}
//		}
//
//		return inputJson;
//	}
	
	public static String inputstringKeyWordHandeler(String jsonString, String testCaseName) {
//		if (jsonString.contains("$ID:")) {
//			jsonString = replaceIdWithAutogeneratedId(jsonString, "$ID:");
//		}
//
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
//
//		if (jsonString.contains("$CHALLENGEVALUEFORSUNBIRDC$")) {
//
//			HashMap<String, String> mapForChallenge = new HashMap<String, String>();
//			mapForChallenge.put(GlobalConstants.FULLNAME, fullNameForSunBirdR);
//			mapForChallenge.put(GlobalConstants.DOB, dobForSunBirdR);
//
//			String challenge = gson.toJson(mapForChallenge);
//
//			String challengeValue = BiometricDataProvider.toBase64Url(challenge);
//
//			jsonString = replaceKeywordValue(jsonString, "$CHALLENGEVALUEFORSUNBIRDC$", challengeValue);
//		}
//
//		if (jsonString.contains("$PUBLICKEYFORBINDING$")) {
//			jsonString = replaceKeywordValue(jsonString, "$PUBLICKEYFORBINDING$",
//					generatePublicKeyForMimoto());
//		}
//
//		if (jsonString.contains("$INJIREDIRECTURI$")) {
//			jsonString = replaceKeywordValue(jsonString, "$INJIREDIRECTURI$",
//					ApplnURI.replace(GlobalConstants.API_INTERNAL, "injiweb") + "/redirect");
//		}
//
//		if (jsonString.contains("$GETCLIENTIDFORMOSIPIDFROMMIMOTOACTUATOR$")) {
//			String clientIdSection = MimotoConfigManager.getproperty("mimoto-oidc-mosipid-partner-clientid");
//			jsonString = replaceKeywordWithValue(jsonString, "$GETCLIENTIDFORMOSIPIDFROMMIMOTOACTUATOR$",
//					getValueFromMimotoActuator("overrides", clientIdSection));
//		} else if (jsonString.contains("$GETCLIENTIDFORINSURANCEFROMMIMOTOACTUATOR$")) {
//			String clientIdSection = MimotoConfigManager.getproperty("mimoto-oidc-sunbird-partner-clientid");
//			jsonString = replaceKeywordWithValue(jsonString, "$GETCLIENTIDFORINSURANCEFROMMIMOTOACTUATOR$",
//					getValueFromMimotoActuator("overrides", clientIdSection));
//		}
//
		return jsonString;

	}
	
//	public static String replaceKeywordValue(String jsonString, String keyword, String value) {
//		if (value != null && !value.isEmpty())
//			return jsonString.replace(keyword, value);
//		else {
//			if (keyword.contains("$ID:"))
//				throw new SkipException("Marking testcase as skipped as required field is empty " + keyword
//						+ " please check the results of testcase: " + getTestCaseIDFromKeyword(keyword));
//			else
//				throw new SkipException("Marking testcase as skipped as required field is empty " + keyword);
//
//		}
//	}
	
//	public static String generatePublicKeyForMimoto() {
//
//		String vcString = "";
//		try {
//			KeyPairGenerator keyPairGenerator = getKeyPairGeneratorInstance();
//			KeyPair keyPair = keyPairGenerator.generateKeyPair();
//			PublicKey publicKey = keyPair.getPublic();
//			StringWriter stringWriter = new StringWriter();
//			try (JcaPEMWriter pemWriter = new JcaPEMWriter(stringWriter)) {
//				pemWriter.writeObject(publicKey);
//				pemWriter.flush();
//				vcString = stringWriter.toString();
//				if (System.getProperty("os.name").toLowerCase().contains("windows")) {
//					vcString = vcString.replaceAll("\r\n", "\\\\n");
//				} else {
//					vcString = vcString.replaceAll("\n", "\\\\n");
//				}
//			} catch (Exception e) {
//				throw e;
//			}
//		} catch (Exception e) {
//			logger.error(e.getMessage());
//		}
//		return vcString;
//	}

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
//			logger.error(GlobalConstants.EXCEPTION_STRING_2 + e);
//			logger.error("Unable to fetch the value from the actuator. URL = " + url + " section = " + section + " key "
//					+ key);
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
	
	   public static JSONArray getRequiredField()  {
		   
			 
		    
		    JSONObject requestJson = new JSONObject();
		    kernelAuthLib = new KernelAuthentication();
		    String token = kernelAuthLib.getTokenByRole(GlobalConstants.ADMIN);
		    String url = getSchemaURL();

		    Response response = RestClient.getRequestWithCookie(url, MediaType.APPLICATION_JSON, MediaType.APPLICATION_JSON,
		            GlobalConstants.AUTHORIZATION, token);

		    org.json.JSONObject responseJson = null;
			try {
				responseJson = new org.json.JSONObject(response.asString());
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		    org.json.JSONObject schemaData = null;
			try {
				schemaData = (org.json.JSONObject) responseJson.get(GlobalConstants.RESPONSE);
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			Double idSchemaVersion = 0.2;
			Double schemaVersion = 0.2;
		   
//		    try {
//				idSchemaVersion = ((BigDecimal) schemaData.get(GlobalConstants.ID_VERSION)).doubleValue();
//			} catch (JSONException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
		    String schemaJsonData = null;
			try {
				schemaJsonData = schemaData.getString(GlobalConstants.SCHEMA_JSON);
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

		    String schemaFile = schemaJsonData;
		    
		    JSONObject schemaFileJson = null;
			try {
				schemaFileJson = new JSONObject(schemaFile);
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	        JSONObject schemaPropsJson = null;
			try {
				schemaPropsJson = schemaFileJson.getJSONObject("properties");
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	        JSONObject schemaIdentityJson = null;
			try {
				schemaIdentityJson = schemaPropsJson.getJSONObject("identity");
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	         try {
				globalRequiredFields = schemaIdentityJson.getJSONArray("required");
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

			return globalRequiredFields;
		    
	   }

}