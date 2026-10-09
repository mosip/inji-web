Feature: OVP verification using inji verify

  @oidcLogin @preResetPasscode @NeedsPolicy @verifyingVpVerification @mutatesWalletCards
  Scenario Outline: Verify OVP verification using inji verify for Sunbird Credentials
    When user performs token-based login using Gmail refresh token
    And user enters the passcode "<initialPasscode>"
    And user click on submit button
    And User search the issuers sunbird
    And User verify sunbird credentials button
    And User click on sunbird credentials button
    Then User verify list of credential types displayed
    And User verify sunbird rc insurance verifiable credential displayed
    And User click on sunbird rc insurance verifiable credential button
    And User enter the policy number
    And User enter the full name
    And User enter the date of birth
    And User click on login button
    When User opens inji verify in new tab
    And User click on vp verification tab
    And User click on request verifiable credentials button
    And User uncheck MOSIP ID
    And User select Health Insurance
    And User click on open wallet button
    And User selects configured inji web wallet in verifier
    And User click on wallet proceed button
    And User click on trust verifier
    And User selects the credential for verification
    And User clicks consent and share button
    Then VP result is posted back to inji verify successfully

    Examples:
      | initialPasscode |
      | 123456          |


  @oidcLogin @preResetPasscode @NeedsUIN @verifyingVpVerification @mutatesWalletCards
  Scenario Outline: Verify OVP verification using inji verify for MOSIP credentials
    When user performs token-based login using Gmail refresh token
    And user enters the passcode "<initialPasscode>"
    And user click on submit button
    Then user click on stored credentials button
    Then User click on cards button
    And User search the issuers mosip
    When User click on download mosip credentials button
    Then User verify list of credential types displayed
    And User verify mosip national id by e-signet displayed
    When User click on mosip national id by e-signet button
    And User verify login page lables
    And User verify vid input box header
    And User enter the uin
    And User click on getOtp button
    And User enter the otp
    And User click on verify button
    Then User verifies mosip vc is downloaded successfully
    When User opens inji verify in new tab
    And User click on vp verification tab
    And User click on request verifiable credentials button
    And User click on open wallet button
    And User selects configured inji web wallet in verifier
    And User click on wallet proceed button
    And User click on trust verifier
    And User selects the credential for verification
    And User clicks consent and share button
    Then VP result is posted back to inji verify successfully

    Examples:
      | initialPasscode |
      | 123456          |