Feature: Login using Sunbird Credentials

  @smoke @VerifyAndDownloadVcViaSunbirdInsurance
  Scenario Outline: download vc via sunbird
    Then User gets the title of the page
    Then User click on continue as guest
    And User search the issuers sunbird
    And User verify sunbird cridentials button
    And User click on sunbird cridentials button
    Then User verify list of credential types displayed
    And User verify sunbird rc insurance verifiable credential displayed
    And User click on sunbird rc insurance verifiable credential button
    Then User click on data share content validity
    Then User click on select custom validity button
    Then user enter validity for data share content "<Vailidty>"
    Then Use click on procced button
    And User enter the policy number
    And User enter the full name
    And User enter the date of birth
    And User click on login button
    Then User verify Download Success text displayed
    And User verify pdf is downloaded for Insurance
    And User verify go home button

    Examples:
      | policy number | full name | date of birth | Vailidty |
      | 1207205244    | automationtest1      | 01-01-2024    |3|

  @smoke @VerifyAndDownloadVcViaSunbirdLife
  Scenario Outline: download vc via sunbird life
    Then User gets the title of the page
    Then User click on continue as guest
    And User search the issuers sunbird
    And User verify sunbird cridentials button
    And User click on sunbird cridentials button
    Then User verify list of credential types displayed
    And User verify life Insurance displayed
    And User click on life Insurance button
    Then User click on data share content validity
    Then User click on select custom validity button
    Then user enter validity for data share content "<Vailidty>"
    Then Use click on procced button
    And User verify policy number input box header
    And User enter the policy number
    And User verify full name input box header
    And User enter the full name
    And User verify date of birth input box header
    And User enter the date of birth
    And User click on login button
    Then User verify Download Success text displayed
    And User verify go home button
    

    Examples:
      | policy number | full name | date of birth | Vailidty |
      |    1207205244 | automationtest1      | 01-01-2024    |3|
#
  @smoke @VerifyAndDownloadVcViaSunbirdLifeWithInvalidPolicyNumber
  Scenario Outline: download vc via sunbird with invalid policy number
    Then User gets the title of the page
    Then User click on continue as guest
    And User search the issuers sunbird
    And User verify sunbird cridentials button
    And User click on sunbird cridentials button
    Then User verify list of credential types displayed
    And User verify life Insurance displayed
    And User click on life Insurance button
    Then User click on data share content validity
    Then User click on select custom validity button
    Then user enter validity for data share content "<Vailidty>"
    Then Use click on procced button
    And User verify policy number input box header
    And User enter the policy number "<policy number>"
    And User verify full name input box header
    And User enter the full name
    And User verify date of birth input box header
    And User enter the date of birth
    And User click on login button
    Then User verify authentication failed message

    Examples:
      | policy number | full name | date of birth | Vailidty |
      |     1207202 | automationtest1      | 01-01-2024    |  3 |

  @smoke @VerifyAndDownloadVcViaVehicleInsuranceWithInvaildName
  Scenario Outline: download vc via sunbird with invalid name
    Then User gets the title of the page
    Then User click on continue as guest
    And User search the issuers sunbird
    And User verify sunbird cridentials button
    And User click on sunbird cridentials button
    Then User verify list of credential types displayed
    And User verify Vehicle Insurance displayed
    And User click on Vehicle Insurance button
    Then User click on data share content validity
    Then User click on select custom validity button
    Then user enter validity for data share content "<Vailidty>"
    Then Use click on procced button
    And User verify policy number input box header
    And User enter the policy number
    And User verify full name input box header
    And User enter the full name  "<full name>"
    And User verify date of birth input box header
    And User enter the date of birth
    And User click on login button
    Then User verify authentication failed message

    Examples:
      | policy number | full name | date of birth | Vailidty |
      |     1207205244 | PolicyTestNam     | 01-01-2024    | 3 |

  @smoke @VerifyAndDownloadVcViaVehicleInsurance
  Scenario Outline: download vc via sunbird vehicle insurance
    Then User gets the title of the page
    Then User click on continue as guest
    And User search the issuers sunbird
    And User verify sunbird cridentials button
    And User click on sunbird cridentials button
    Then User verify list of credential types displayed
    And User verify Vehicle Insurance displayed
    And User click on Vehicle Insurance button
    Then User click on data share content validity
    Then User click on select custom validity button
    Then user enter validity for data share content "<Vailidty>"
    Then Use click on procced button
    And User verify policy number input box header
    And User enter the policy number
    And User verify full name input box header
    And User enter the full name
    And User verify date of birth input box header
    And User enter the date of birth
    And User click on login button
    Then User verify Download Success text displayed

    Examples:
      | policy number | full name | date of birth | Vailidty |
      |    1207205244 | automationtest1      | 01-01-2024    | 3 |