Feature: Inji web multilanguage testing

  @smoke @verifyingLanguages
  Scenario: Verify the Inji web configured language
  Given User gets the title of the page
  Then User validate the title of the page
  Then User click on get started button
  And User verify that inji web logo is displayed
  And User verify that langauge button is displayed
  And User click on langauge button
  And User verify All the languages

  @smoke @verifyingHomepageAndSearchInConfiguredLanguge
  Scenario: Verify the Inji web homepage
    Given User gets the title of the page
    Then User validate the title of the page
    Then User click on get started button
    And User verify that inji web logo is displayed
    And User verify that langauge button is displayed
    And User click on langauge button
    And User click on arabic langauge
    And User verify home screens in arabic
    And User search the issuers with "الوطنية"
    And User verify mosip national id by e-signet displayed
    And User click on langauge button
    And User click on tamil langauge
    And User verify home screens in tamil
    And User search the issuers with "தேசிய"
    And User verify mosip national id by e-signet displayed
    And User click on langauge button
    And User click on kannada langauge
    And User verify home screens in kannada
    And User search the issuers with "ರಾಷ್ಟ್ರೀ"
    And User verify mosip national id by e-signet displayed
    And User click on langauge button
    And User click on hindi langauge
    And User verify home screens in hindi
    And User search the issuers with "राष्ट्रीय"
    And User verify mosip national id by e-signet displayed
    And User click on langauge button
    And User click on french langauge
    And User verify home screens in french
    And User search the issuers with "National Identity Department"
    And User verify mosip national id by e-signet displayed
    And User click on langauge button
    And User click on portugues langauge
    And User verify home screens in portugues
    And User search the issuers with "National Identity Department"
    And User verify mosip national id by e-signet displayed

  @smoke @verifyingCredentialDetailsPageForMosipInConfiguredLanguge
  Scenario: Verify the Credential Details Page
    Given User gets the title of the page
    Then User validate the title of the page
    Then User click on get started button
    And User verify that inji web logo is displayed
    And User search the issuers with "National"
    When User click on download mosip credentials button
    Then User validate the list of credential types title of the page
    And User click on langauge button
    And User click on arabic langauge
    Then User validate the list of credential types title of the page in arabic laguage
    And User click on langauge button
    And User click on kannada langauge
    Then User validate the list of credential types title of the page in kannada laguage
    And User click on langauge button
    And User click on hindi langauge
    Then User validate the list of credential types title of the page in hindi laguage
    And User click on langauge button
    And User click on french langauge
    Then User validate the list of credential types title of the page in french laguage
    And User click on langauge button
    And User click on tamil langauge
    Then User validate the list of credential types title of the page in tamil laguage
    And User click on langauge button
    And User click on portugues langauge
    Then User validate the list of credential types title of the page in portugues laguage

  @smoke @verifyingCredentialDetailsPageForSunbirdInConfiguredLanguge
  Scenario: Verify the Credential Details Page
    Given User gets the title of the page
    Then User validate the title of the page
    Then User click on get started button
    And User verify that inji web logo is displayed
    And User search the issuers with "Insurance"
    And User verify sunbird cridentials button
    And User click on sunbird cridentials button
    And User validate the list of credential types title of the page for sunbird
    And User click on langauge button
    And User click on arabic langauge
    And User search the issuers with "life"
    Then User validate the list of credential types title of the page in arabic laguage for sunbird
    And User click on langauge button
    And User click on tamil langauge
    And User search the issuers with "life"
    Then User validate the list of credential types title of the page in tamil laguage for sunbird
    And User click on langauge button
    And User click on kannada langauge
    And User search the issuers with "life"
    Then User validate the list of credential types title of the page in kannada laguage for sunbird
    And User click on langauge button
    And User click on hindi langauge
    And User search the issuers with "life"
    Then User validate the list of credential types title of the page in hindi laguage for sunbird
    And User click on langauge button
    And User click on french langauge
    And User search the issuers with "life"
    Then User validate the list of credential types title of the page in french laguage for sunbird
    And User click on langauge button
    And User click on portugues langauge
    And User search the issuers with "life"
    Then User validate the list of credential types title of the page in portugues laguage for sunbird

  @smoke @verifyingChangeLanguageOnCredentialDetailsPageAndVerifyHomePage
  Scenario: Verify the Credential Details Page
    Given User gets the title of the page
    Then User validate the title of the page
    Then User click on get started button
    And User verify that inji web logo is displayed
    And User search the issuers with "National"
    When User click on download mosip credentials button
    Then User validate the list of credential types title of the page
#    And User click on langauge button
#    And User click on arabic langauge
#    And User click on back button
#    And User verify home screens in arabic
#    And User search the issuers with "الوطنية"
#    And User verify mosip national id by e-signet displayed
#    When User click on download mosip credentials button
    And User click on langauge button
    And User click on tamil langauge
    And User click on back button
    And User verify home screens in tamil
    And User search the issuers with "தேசிய"
    And User verify mosip national id by e-signet displayed
    When User click on download mosip credentials button
    And User click on langauge button
    And User click on kannada langauge
    And User click on back button
    And User verify home screens in kannada
    And User search the issuers with "ರಾಷ್ಟ್ರೀ"
    And User verify mosip national id by e-signet displayed
    When User click on download mosip credentials button
    And User click on langauge button
    And User click on hindi langauge
    And User click on back button
    And User verify home screens in hindi
    And User search the issuers with "राष्ट्रीय"
    And User verify mosip national id by e-signet displayed
    When User click on download mosip credentials button
    And User click on langauge button
    And User click on french langauge
    And User click on back button
    And User verify home screens in french
    And User search the issuers with "National Identity Department"
    And User verify mosip national id by e-signet displayed
    When User click on download mosip credentials button
    And User click on langauge button
    And User click on portugues langauge
    And User click on back button
    And User verify home screens in portugues
    And User search the issuers with "National Identity Department"
    And User verify mosip national id by e-signet displayed


  @smoke @verifyingHomepageAndSearchInConfiguredLanguge
  Scenario: Verify the Inji web homepage
    Given User gets the title of the page
    Then User validate the title of the page
    Then User click on get started button
    And User verify that inji web logo is displayed
    And User verify that langauge button is displayed
    And User click on langauge button
    And User click on arabic langauge
    And User verify home screens in arabic
    And User clicks on the help button
    And User verify the FAQ header and its description
    And User verify the only one FAQ is open
    And User verify the only one FAQ is at a time
    And User verify that inji web logo is displayed
    And User click on langauge button
    And User click on tamil langauge
    And User verify the FAQ header and its description
    And User verify the only one FAQ is open
    And User verify the only one FAQ is at a time
    And User verify that inji web logo is displayed
    And User click on langauge button
    And User click on kannada langauge
    And User verify the FAQ header and its description
    And User verify the only one FAQ is open
    And User verify the only one FAQ is at a time
    And User verify that inji web logo is displayed
    And User click on langauge button
    And User click on hindi langauge
    And User verify the FAQ header and its description
    And User verify the only one FAQ is open
    And User verify the only one FAQ is at a time
    And User verify that inji web logo is displayed
    And User click on langauge button
    And User click on french langauge
    And User verify the FAQ header and its description
    And User verify the only one FAQ is open
    And User verify the only one FAQ is at a time
    And User verify that inji web logo is displayed
    And User click on langauge button
    And User click on portugues langauge
    And User verify the FAQ header and its description
    And User verify the only one FAQ is open
    And User verify the only one FAQ is at a time
    And User verify that inji web logo is displayed