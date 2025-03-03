Feature: Inji web homepage testing

  @smoke @verifyingHomepage
  Scenario: Verify the Inji web homepage
    Given User gets the title of the page
    Then User validate the title of the page
    Then User verify that home banner heading
    Then User verify that home banner description
    Then User verify that home banner get started
    Then User verify that home features heading
    Then User verify that home features description1
    Then User verify that home features mobile image
    Then User verify that home features desktop image
    Then User verify that home feature item image
    Then User verify that home feature Heading
    Then User verify that home feature item header for all
    Then User verify that home feature feature description
    Then User click on get started button
    Then User verify header displayed
    Then User verify that home page container displayed
    Then User verify the footer on home page
    And User verify that inji web logo is displayed
    And User verify that on home page searchbox is present
    And User verify that langauge button is displayed

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