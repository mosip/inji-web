#Author: mohanachandran.s@technoforte.co.in
#Keywords Summary :
#Feature: List of scenarios.
#Scenario: Business rule through list of steps with arguments.
#Given: Some precondition step
#When: Some key actions
#Then: To observe outcomes or validation
#And,But: To enumerate more Given,When,Then steps
#Scenario Outline: List of steps for data-driven as an Examples and <placeholder>
#Examples: Container for s table
#Background: List of steps run before each of the scenarios
#""" (Doc Strings)
#| (Data Tables)
#@ (Tags/Labels):To group Scenarios
#<> (placeholder)
#""
## (Comments)
Feature: Inji web homepage testing

  @smoke @verifyingHomepage
  Scenario: Verify the Inji web homepage
    Given User gets the title of the page
    Then User validate the title of the page
    And User verify that inji web logo is displayed
    And User verify that langauge button is displayed
    
    @smoke @verifyingThreeMinutesPause
 Scenario: Verify the Inji web homepage and wait for three min
    Given User gets the title of the page
    Then User validate the title of the page
    And User verify that inji web logo is displayed
    And User verify that langauge button is displayed
    And User wait for three min on home page
    
      @smoke @verifyingHomepageInArabic
  Scenario: Verify the Inji web homepage
    Given User gets the title of the page
    Then User validate the title of the page
    And User verify that inji web logo is displayed
    And User verify that langauge button is displayed