package utils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Properties;

public class HttpUtils {

	private static final String PROPERTIES_PATH = "src/test/resources/config.properties";

	private static final Properties properties = loadProperties();
	private static final ObjectMapper objectMapper = new ObjectMapper();

	public static String getIdToken() throws IOException {
		String clientId = properties.getProperty("google.client.id");
		String clientSecret = properties.getProperty("google.client.secret");
		String refreshToken = properties.getProperty("google.refresh.token");

		URL url = new URL("https://oauth2.googleapis.com/token");
		String urlParameters = "client_id=" + URLEncoder.encode(clientId, "UTF-8") + "&client_secret="
				+ URLEncoder.encode(clientSecret, "UTF-8") + "&refresh_token="
				+ URLEncoder.encode(refreshToken, "UTF-8") + "&grant_type=refresh_token";

		HttpURLConnection conn = (HttpURLConnection) url.openConnection();
		conn.setRequestMethod("POST");
		conn.setDoOutput(true);

		try (OutputStream os = conn.getOutputStream()) {
			os.write(urlParameters.getBytes("UTF-8"));
		}

		int responseCode = conn.getResponseCode();
		if (responseCode != 200) {
			String errorResponse = readErrorResponse(conn);
			throw new RuntimeException(
					"Failed to get ID token. HTTP error code: " + responseCode + ", response: " + errorResponse);
		}

		String response = readResponse(conn);
		JsonNode rootNode = objectMapper.readTree(response);
		JsonNode idTokenNode = rootNode.get("id_token");

		if (idTokenNode == null || idTokenNode.asText().isEmpty()) {
			throw new RuntimeException("id_token not found in response: " + response);
		}

		String idToken = idTokenNode.asText();
		System.out.println("Obtained id_token: " + idToken); // Debug log
		return idToken;
	}

	public static String getSessionCookieFromIdToken(String idToken) throws IOException {
		String tokenLoginUrl = properties.getProperty("injiweb.token.login.url");
		if (tokenLoginUrl == null || tokenLoginUrl.isEmpty()) {
			throw new RuntimeException("Token login URL is not configured in properties");
		}

		URL url = new URL(tokenLoginUrl);
		HttpURLConnection conn = (HttpURLConnection) url.openConnection();
		conn.setRequestMethod("POST");
		conn.setRequestProperty("Accept", "application/json");
		conn.setRequestProperty("Authorization", "Bearer " + idToken); // 👈 required
		conn.setDoOutput(true);

		// Send empty JSON body
		String body = "{}";
		try (OutputStream os = conn.getOutputStream()) {
			os.write(body.getBytes("UTF-8"));
		}

		int responseCode = conn.getResponseCode();
		if (responseCode != 200) {
			String errorResponse = readErrorResponse(conn);
			throw new RuntimeException(
					"Failed to get session cookie. HTTP code: " + responseCode + ", response: " + errorResponse);
		}

		String cookie = conn.getHeaderField("Set-Cookie");
		if (cookie == null || (!cookie.contains("SESSION") && !cookie.contains("connect.sid"))) {
			throw new RuntimeException("Session cookie not found in response headers");
		}

		String sessionCookie = cookie.split(";")[0];
		System.out.println("Received session cookie: " + sessionCookie); // Debug log
		return sessionCookie;
	}

	// Helpers
	private static Properties loadProperties() {
		Properties props = new Properties();
		try (FileInputStream fis = new FileInputStream(PROPERTIES_PATH)) {
			props.load(fis);
		} catch (IOException e) {
			throw new RuntimeException("Failed to load config.properties", e);
		}
		return props;
	}

	private static String readResponse(HttpURLConnection conn) throws IOException {
		try (BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
			StringBuilder response = new StringBuilder();
			String line;
			while ((line = in.readLine()) != null) {
				response.append(line);
			}
			return response.toString();
		}
	}

	private static String readErrorResponse(HttpURLConnection conn) throws IOException {
		InputStream errorStream = conn.getErrorStream();
		if (errorStream == null) {
			return "";
		}
		try (BufferedReader reader = new BufferedReader(new InputStreamReader(errorStream))) {
			StringBuilder sb = new StringBuilder();
			String line;
			while ((line = reader.readLine()) != null) {
				sb.append(line);
			}
			return sb.toString();
		}
	}
}
