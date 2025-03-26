package api;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import org.apache.log4j.Logger;

import io.mosip.testrig.apirig.utils.ConfigManager;
import runnerfiles.Runner;

public class InjiWebConfigManager extends ConfigManager{
	private static final Logger LOGGER = Logger.getLogger(InjiWebConfigManager.class);
	
	public static void init() {
		Map<String, Object> moduleSpecificPropertiesMap = new HashMap<>();
		// Load scope specific properties
		try {
			String path = Runner.getGlobalResourcePath() + "/config/injiweb.properties";
			Properties props = getproperties(path);
			// Convert Properties to Map and add to moduleSpecificPropertiesMap
			for (String key : props.stringPropertyNames()) {
				moduleSpecificPropertiesMap.put(key, props.getProperty(key));
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage());
		}
		// Add module specific properties as well.
		init(moduleSpecificPropertiesMap);
	}
	
	
	public static Boolean IsDebugEnabled() { return getproperty("enableDebug").equalsIgnoreCase("yes"); }  
	
	public static String getapiEndUser() { return getproperty("apiEnvUser"); }
	
	
	public static String getSunbirdBaseURL() {
		return InjiWebUtil.getValueFromMimotoActuator("overrides", "mosip.sunbird.url");
		
	}

}