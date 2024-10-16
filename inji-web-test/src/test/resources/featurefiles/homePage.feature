Feature: Inji web homepage testing

  @smoke @verifyingHomepage
  Scenario: Verify the Inji web homepage
    Given User gets the title of the page
    Then User validate the title of the page
    Then User verify header displayed
    Then User verify that home page container displayed
    Then User verify the footer on home page
    And User verify that inji web logo is displayed
    And User verify that about inji web displayed
    And User verify that on home page searchbox is present
    And User verify that langauge button is displayed
    And User verify click on about inji page
    And User verify About inji open

  @smoke @verifyingHomepageInArabic
  Scenario: Verify the Inji web homepage
    Given User gets the title of the page
    Then User validate the title of the page
    And User verify that inji web logo is displayed
    And User verify that langauge button is displayed

  @smoke @verifyingHomepageInMultipleTabs
  Scenario: Verify the Inji web homepage
    Given User gets the title of the page
    Then User validate the title of the page
    And User verify that inji web logo is displayed
    And User verify that langauge button is displayed
    And User open new tab
    Then User validate the title of the page
    And User verify that inji web logo is displayed
    Then User validate the title of the page
    And User verify that inji web logo is displayed
    And User verify that langauge button is displayed
    When User clicks on the help button