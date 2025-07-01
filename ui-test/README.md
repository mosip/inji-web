# Inji Web  Automation - web Automation Framework using selenium with cucumber

## Overview

Inji-Web-test Automation is a robust and comprehensive web automation framework built using Selenium and Cucumber. It's specifically designed to automate testing scenarios for the Inji web application, covering both positive and negative test cases. The framework's modular structure and efficient execution capabilities ensure thorough testing of the web application's functionality.

## Pre-requisites

Ensure the following software is installed on the machine from where the automation tests will be executed:
- The project requires JDK 21
- Maven 3.6.0 or higher
- Generate Google clinet ID and Secret for OIDC login
- Generate refresh token for the google user
- Set the env variables for refresh token, client id and client secret. 

Ex: 
export MOISP_INJIWEB_GOOGLE_REFRESH_TOKEN=<<refresh token>>
export MOSIP_INJIWEB_GOOGLE_CLIENT_ID=<<google clinet id>>
export MOSIP_INJIWEB_GOOGLE_CLIENT_SECRET=<<client secret>>


## BrowserStack
1. singup to browserStack & get the userName and accessKey from home page on browserStack  
2. update the userName and accessKey from browserstack.yml
3. update the device from tag `platforms` from `https://www.browserstack.com/list-of-browsers-and-platforms/automate` (Windows, Mac)
4. Open command prompt and change directory by using command 'cd ../inji-web-test'
5. Execute the mvn clean package
6. java -cp target/uitest-injiweb-<<release version>>-SNAPSHOT.jar -Dmosip.inji.web.url=<<url for inji web>> -Dmodules=ui-test -Denv.user=api-internal.released -Denv.endpoint=https://api-internal.released.mosip.net runnerfiles.Runner testNgXmlFiles/masterSuite.xml

Get the release version from the pom.xml file
    <artifactId>uitest-injiweb</artifactId>
    <version>0.12.0-SNAPSHOT</version>

Ex: java -cp target/uitest-injiweb-0.12.0-SNAPSHOT.jar -Dmosip.inji.web.url=https://injiweb.qa-inji1.mosip.net/ -Dmodules=ui-test -Denv.user=api-internal.released -Denv.endpoint=https://api-internal.released.mosip.net -Denv.testLevel=smokeAndRegression  runnerfiles.Runner testNgXmlFiles/masterSuite.xml

## Reports
Test reports will be available in the `ui-test/test-output/` directory after test execution.
