# Inji Web  Automation - web Automation Framework using selenium with cucumber

## Overview

Inji-Web-test Automation is a robust and comprehensive web automation framework built using Selenium and Cucumber. It's specifically designed to automate testing scenarios for the Inji web application, covering both positive and negative test cases. The framework's modular structure and efficient execution capabilities ensure thorough testing of the web application's functionality.

## Pre-requisites

Ensure the following software is installed on the machine from where the automation tests will be executed:
- Java 21
- Maven 3.6.0 or higher

## Build
1. Clone the repository by git clone https://github.com/mosip/inji-web.git
2. Change directory by using command 'cd ../inji-web-test'  & Build the JAR file: `mvn clean package -DskipTests=true`
3. The JAR file will be generated in the `target` directory.
4. For running tests on Device Farm, use the JAR file with dependencies (`zip-with-dependencies`).

## Configurations

1. Update `featurefile>>subirdVc.feature,downloadMosipCredentials.feature` to modify data in examples section.

## Reports

Test reports will be available in the `test-output>>ExtentReports>>SparkReports` directory after test execution.