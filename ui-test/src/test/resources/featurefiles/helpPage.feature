Feature: Inji web help page testing

  @regression @verifyHelpPage
  Scenario: verify Help Page
    Given User gets the title of the page
    Then User validate the title of the page
    When User clicks on the help button
    And User verify the FAQ header and its description
    And User verify the only one FAQ is open
    And User verify the only one FAQ is at a time
    And User verify that inji web logo is displayed
