@sequential
Feature: download mosip cridentials

  @smoke @VerifyAndDownloadVcViaMosipNatinalId @mobileview
  Scenario Outline: Mosip Natonal Id by e-Signet
    Then User gets the title of the page
    Then User click on continue as guest
    And User search the issuers mosip
    When User click on download mosip credentials button
    Then User verify search and title are appeare in diff lines
    Then User verify list of credential types displayed
    And User verify mosip national id by e-signet displayed
    When User click on mosip national id by e-signet button
    Then User click on data share content validity
    Then User click on select custom validity button
    Then user enter validity for data share content "<Validity>"
    Then Use click on procced button
    And User verify login page lables
    And User verify vid input box header
    And User enter the uin
    And User click on getOtp button
    And User enter the otp
    And User click on verify button
    And User verify downloading in progress text
    And User verify go home button
    Then User verify Download Success text displayed
    And User verify pdf is downloaded
    Examples:
      | Validity |
      | 3        |
