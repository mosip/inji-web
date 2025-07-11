package utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import org.yaml.snakeyaml.Yaml;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.Map;
import java.util.Random;

public class UinGenerationUtil {

	public static String getResourcePath() {
		return System.getProperty("user.dir") + "/src/main/resources";
	}

	public static String checkRunType() {
//        if (UinGenerationUtil.class.getResource("TestRunner.class").getPath().contains(".jar"))
//            return "JAR";
		return "IDE";
	}

	public static String getKernalFilename() {
		String path = "Kernel.properties";
		String kernalpath = null;
		if (System.getProperty("env.user") == null) {
			kernalpath = "Kernel.properties";
		} else {
			kernalpath = "Kernel_" + path + ".properties";
		}
		return path;
	}

	public static String getRandomUin() {

		return getRandomUinOrVidOrAid("Uins.json");
	}

	public static String getRandomVid() {
		return getRandomUinOrVidOrAid("Vids.json");
	}

	public static String getRandomAidData() {

		return getRandomUinOrVidOrAid("AidData.json");
	}

	public static String getRandomEmails(String fileName) {
		ObjectMapper mapper = new ObjectMapper();
		ArrayNode arrayNode = null;
		try {
			arrayNode = (ArrayNode) mapper
					.readTree(new File(System.getProperty("user.dir") + "/src/main/resources/" + fileName));
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
		Random random = new Random();
		int randomIndex = random.nextInt(arrayNode.size());
		String email = arrayNode.get(randomIndex).asText();
		String emailValue = email.stripLeading().stripTrailing();
		return emailValue;
	}

	public static String getRandomUinOrVidOrAid(String jsonFileName) {
		ObjectMapper mapper = new ObjectMapper();
		ArrayNode arrayNode = null;
		try {
			arrayNode = (ArrayNode) mapper
					.readTree(new File(System.getProperty("user.dir") + "/src/main/resources/" + jsonFileName));
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
		Random random = new Random();
		int randomIndex = random.nextInt(arrayNode.size());
		String randomNumber = arrayNode.get(randomIndex).toString();
		return randomNumber;
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

}