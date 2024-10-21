package pages;


import io.restassured.RestAssured;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import org.yaml.snakeyaml.Yaml;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.Map;

public class SetNetwork {

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

        RequestSpecification requestSpec = RestAssured.given()
                .auth().basic(userName, accessKey)
                .header("Content-Type", "application/json")
                .body(networkSettingsJson);

        Response response = requestSpec.put(baseURL + endpoint);
    }

    public static void setNoNetworkProfile(String sessionID) {
        String baseURL = "https://api-cloud.browserstack.com";
        String endpoint = "/app-automate/sessions/" + sessionID + "/update_network.json";
        String accessKey = getKeyValueFromYaml("/browserstack.yml", "accessKey");
        String userName = getKeyValueFromYaml("/browserstack.yml", "userName");
        String networkSettingsJson = "{\"networkProfile\":\"no-network\"}";
        RequestSpecification requestSpec = RestAssured.given()
                .auth().basic(userName, accessKey)
                .header("Content-Type", "application/json")
                .body(networkSettingsJson);
        Response response = requestSpec.put(baseURL + endpoint);
    }


}
