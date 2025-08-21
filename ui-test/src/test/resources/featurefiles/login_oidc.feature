Feature: OIDC Login for InjiWeb

  @oidcLogin
  Scenario Outline: User verify reset passcode attempts
    When user performs token-based login using Gmail refresh token
    And user enters the passcode "<initialPasscode>"
    And user click on submit button
    Then user click on dropdown box for profile
    Then user click on logout button
    When user performs token-based login using Gmail refresh token
    And user enters the wrong passcode "<wrongConfirmation1>" to lessthan max failed attempts
    And user enters the passcode "<initialPasscode>"
    And user click on submit button
    Then user click on dropdown box for profile
    Then user click on logout button
    When user performs token-based login using Gmail refresh token
    And user enters the wrong passcode "<wrongConfirmation1>" for max failed attempts
    Then user wait for temporary lock to expire
    And user enters the passcode "<initialPasscode>"
    And user click on submit button
    Then user click on dropdown box for profile
    Then user click on logout button
    When user performs token-based login using Gmail refresh token
    And user enters the wrong passcode "<wrongConfirmation1>" for max failed attempts
    Then user wait for temporary lock to expire
    And user enters the wrong passcode "<wrongConfirmation1>" to lessthan max failed attempts
    And user enters the passcode "<initialPasscode>"
    And user click on submit button
    Then user click on dropdown box for profile
    Then user click on logout button
    When user performs token-based login using Gmail refresh token
    And user enters the wrong passcode "<wrongConfirmation1>" for max failed attempts
    Then user wait for temporary lock to expire
    And user enters the wrong passcode "<wrongConfirmation1>" for max failed attempts
    Then user wait for temporary lock to expire
    And user enters the wrong passcode "<wrongConfirmation1>" to lessthan max failed attempts
    And user enters the passcode "<initialPasscode>"
    And user click on submit button
    Then user click on dropdown box for profile
    Then user click on logout button
    When user performs token-based login using Gmail refresh token
    And user enters the wrong passcode "<wrongConfirmation1>" for max failed attempts
    Then user wait for temporary lock to expire
    And user enters the wrong passcode "<wrongConfirmation1>" for max failed attempts
    Then user wait for temporary lock to expire
    And user enters the wrong passcode "<wrongConfirmation1>" to lessthan max failed attempts
    Then user verify the warning message before to permanent lock
    And user enters the passcode "<wrongConfirmation1>"
    And user verify the wallet permanently locked
    Then user click on forget passcode option
    Then user click on forget passcode button
    And user enters the passcode "<initialPasscode>"
    And user enters the passcode for confirmation "<initialPasscode>"
    And user click on submit button
    Then user click on dropdown box for profile
    Then user click on logout button
    
  
    Examples:
      | initialPasscode | wrongConfirmation1 |
      | 111111          | 123455             |