Feature: download mosip cridentials

  @smoke @VerifyAndDownloadVcViaMosipNatinalId
  Scenario Outline: Mosip Natonal Id by e-Signet
    Given Load application url "https://inji.qa-inji.mosip.net/"
    Then User gets the title of the page
    Then User click on get started button
    And User search the issuers with "National"
    When User click on download mosip credentials button
    Then User verify list of credential types displayed
    And User verify mosip national id by e-signet displayed
    When User click on mosip national id by e-signet button
    Then User click on data share content validity
    Then User click on select custom validity button
    Then user enter validity for data share content "<Vailidty>"
    Then Use click on procced button
    And User verify login page lables
    And User verify vid input box header
    And User enter the  "<vid>"
    And User click on getOtp button
    And User enter the otp "<otp>"
    And User click on verify button
    And User verify downloading in progress text
    And User verify go home button
    Then User verify Download Success text displayed
    And User verify go back button

    Examples:
      | vid              | otp    | Vailidty |
      | 4391082978460254 | 111111 |   3      |


  @smoke @VerifySearchWithInvalidString
  Scenario: Mosip Natonal Id by e-Signet
    Given Load application url "https://inji.qa-inji.mosip.net/"
    Then User gets the title of the page
    Then User click on get started button
    And User search the issuers with "qewqdda"
    And User Verify the no issuer found message
    And User search the issuers with "National"
    When User click on download mosip credentials button


  @smoke @VerifyAndDownloadVcViaMosipNatinalId
  Scenario Outline: Mosip Natonal Id by e-Signet
    Given Load application url "https://inji.qa-inji.mosip.net/"
    Then User gets the title of the page
    Then User click on get started button
    And User search the issuers with "National"
    And User verify the logo of the issuer
    When User click on download mosip credentials button
    And User verify the logo of the issuer
    Then User verify list of credential types displayed
    And User verify mosip national id by e-signet displayed
    When User click on mosip national id by e-signet button
    Then User click on data share content validity
    Then User click on select custom validity button
    Then user enter validity for data share content "<Vailidty>"
    Then Use click on procced button
    And User verify login page lables
    And User verify vid input box header
    And User enter the  "<vid>"
    And User click on getOtp button
    And User enter the otp "<otp>"
    And User click on verify button
    And User verify go home button
    Then User verify Download Success text displayed
    And User verify pdf is downloaded
    And User verify go back button

    Examples:
      | vid              | otp    | Vailidty |
      | 4391082978460254 | 111111 |     3    |

  @smoke @VerifyAndDownloadVcViaMosipNatinalIdAndRfreshPage
  Scenario Outline: Mosip Natonal Id by e-Signet
    Given Load application url "https://inji.qa-inji.mosip.net/"
    Then User gets the title of the page
    Then User click on get started button
    And User search the issuers with "National"
    When User click on download mosip credentials button
    Then User verify list of credential types displayed
    And User verify mosip national id by e-signet displayed
    When User click on mosip national id by e-signet button
    Then User click on data share content validity
    Then User click on select custom validity button
    Then user enter validity for data share content "<Vailidty>"
    Then Use click on procced button
    And User verify login page lables
    And User verify vid input box header
    And User enter the  "<vid>"
    And User click on getOtp button
    And User enter the otp "<otp>"
    And User click on verify button
    And User verify go home button
    Then User verify Download Success text displayed
    And User verify go back button
    And user refresh the page
    And user verify the page after Refresh

    Examples:
      | vid              | otp    | Vailidty |
      | 4391082978460254 | 111111 |     3     |

