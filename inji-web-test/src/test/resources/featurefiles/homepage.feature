
Feature: Inji web homepage testing

  @smoke @verifyingHomepage
  Scenario: Verify the Inji web homepage
    Given User gets the title of the page
    Then User validate the title of the page
    And User verify that inji web logo is displayed
    And User verify that langauge button is displayed

#    @smoke @verifyingThreeMinutesPause
# Scenario: Verify the Inji web homepage and wait for three min
#    Given User gets the title of the page
#    Then User validate the title of the page
#    And User verify that inji web logo is displayed
#    And User verify that langauge button is displayed
#    And User wait for three min on home page

      @smoke @verifyingHomepageInArabic
  Scenario: Verify the Inji web homepage
    Given User gets the title of the page
    Then User validate the title of the page
    And User verify that inji web logo is displayed
    And User verify that langauge button is displayed