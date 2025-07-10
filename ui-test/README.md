# Inji Web Automation — Web Automation Framework using Selenium with Cucumber

## Overview

**Inji-Web-Test Automation** is a robust and comprehensive web automation framework built using **Selenium** and **Cucumber**.
It's specifically designed to automate testing scenarios for the Inji web application, covering both positive and negative test cases.
The framework's modular structure and efficient execution capabilities ensure thorough testing of the application's functionality.

---

## Pre-requisites

Ensure the following software is installed on the machine from where the automation tests will be executed:

- JDK 21
- Maven 3.6.0 or higher
- Google Client ID and Secret for OIDC login with Gmail
- Gmail Refresh Token

Set the environment variables as follows:

```bash
export MOSIP_INJIWEB_GOOGLE_REFRESH_TOKEN=<<refresh_token>>
export MOSIP_INJIWEB_GOOGLE_CLIENT_ID=<<google_client_id>>
export MOSIP_INJIWEB_GOOGLE_CLIENT_SECRET=<<client_secret>>
export TEST_URL=<<url>>
```

---

## Refresh Token Generation Steps

1. Open the following URL in your browser (replace placeholders with actual values):

```
https://accounts.google.com/o/oauth2/auth?client_id=<<client_id>>&redirect_uri=<<redirect_uri>>&response_type=code&scope=openid%20email%20profile&access_type=offline&prompt=consent
```

2. Provide the **username** and **password** when the API prompts for authentication.

3. After login, you'll be redirected to a URL with a `code` parameter. Example:

```
4%2F0AUJR-x7uK8cRZhqIOZkC1lxt0nWuNvRK3IFVEHmnX5y5y-RPFvSK9-lq9IZbvpRbyfftDA
```

4. Replace `%2F` with `/`:

```
4/0AUJR-x7uK8cRZhqIOZkC1lxt0nWuNvRK3IFVEHmnX5y5y-RPFvSK9-lq9IZbvpRbyfftDA
```

5. Execute the following `curl` command to get the refresh token:

```bash
curl --location 'https://oauth2.googleapis.com/token'   --header 'Content-Type: application/x-www-form-urlencoded'   --data-urlencode 'code=<<code>>'   --data-urlencode 'client_id=<<client_id>>'   --data-urlencode 'client_secret=<<client_secret>>'   --data-urlencode 'redirect_uri=<<redirect_uri>>'
```

---

## BrowserStack Integration

1. Sign up for BrowserStack and get your `username` and `accessKey` from the home page.
2. Update the `browserstack.yml` file with your credentials or export the details as environment variables.

```bash
export BROWSERSTACK_ACCESS_KEY=<<accessKey>>
export BROWSERSTACK_USERNAME=<<username>>
```


3. Choose a device and platform from the list:
   [https://www.browserstack.com/list-of-browsers-and-platforms/automate](https://www.browserstack.com/list-of-browsers-and-platforms/automate)
4. Open a terminal and navigate to the project root:

```bash
cd ../inji-web-test
```

5. Build the project:

```bash
mvn clean package
```

6. Run the test suite using:

```bash
java -cp target/uitest-injiweb-0.12.0-SNAPSHOT.jar   -Dmodules=ui-test   -Denv.user=api-internal.released   -Denv.endpoint=https://api-internal.released.mosip.net   -Denv.testLevel=smokeAndRegression   runnerfiles.Runner testNgXmlFiles/masterSuite.xml
```

---

## Reports

Test reports will be generated under:

```
ui-test/test-output/
```

---

## Extent Report — Environment Details

To include environment and system details in the Extent Report dashboard, add the following snippet to `ExtentReportManager.java`:

```java
	extent.setSystemInfo("Git Branch", branch != null ? branch : "N/A");
	extent.setSystemInfo("Commit ID", commitId != null ? commitId : "N/A");
	extent.setSystemInfo("TEST_URL", testUrl);
	extent.setSystemInfo("Execution Time", timestamp);

```

This enhances traceability and adds execution context to your HTML report.