# Inji Web  Automation - web Automation Framework using selenium with cucumber

## Overview

Inji-Web-test Automation is a robust and comprehensive web automation framework built using Selenium and Cucumber. It's specifically designed to automate testing scenarios for the Inji web application, covering both positive and negative test cases. The framework's modular structure and efficient execution capabilities ensure thorough testing of the web application's functionality.

## Pre-requisites

Ensure the following software is installed on the machine from where the automation tests will be executed:
- The project requires JDK 21
- Maven 3.6.0 or higher

## BrowserStack
1. singup to browserStack & get the userName and accessKey from home page on browserStack  
2. update the userName and accessKey from browserstack.yml
3. update the device from tag `platforms` from `https://www.browserstack.com/list-of-browsers-and-platforms/automate` (Windows, Mac)
4. Open command prompt and change directory by using command 'cd ../inji-web-test'
5. Hit the command `mvn clean test -DtestngXmlFile=TestNg.xml`, for running the UI automation test

## Configurations

1. Update `featurefile>>subirdVc.feature,downloadMosipCredentials.feature` to modify data in examples section.

## Reports

Test reports will be available in the `test-output>>ExtentReports>>SparkReports` directory after test execution.
