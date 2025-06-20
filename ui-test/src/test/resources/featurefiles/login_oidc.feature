Feature: OIDC Login for InjiWeb
  
  @oidcLogin
  Scenario: User first time login
    When user performs token-based login using Gmail refresh token
    Then user verifies the submit button is not enabled
    And user enters the passcode "123456"
    Then user click on toggle button
    Then user verify the toggle button
    And user enters the passcode for confirmation "123455"
    And user click on submit button
    Then user prints error message for mismatch
    Then user prints verify message for mismatch
    And user enters the passcode for confirmation "abcdef"
    Then user click on toggle button for confimration
    And user enters the passcode for confirmation "123456"
    And user click on toggle button for confimration
    Then user toggles the password visibility using keyboard and verifies it
    And user click on submit button
    Then user click on dropdown box for profile
    Then user click on logout button
    When user performs token-based login using Gmail refresh token
    And user enters the passcode "12345"
    Then user verifies the submit button is not enabled
    And user enters the passcode "123456"
    Then user toggles the password visibility using keyboard and verifies it
    And user click on submit button
  
  
  @oidcLogin
  Scenario: Profile page verification
    When user performs token-based login using Gmail refresh token
    And user enters the passcode "123456"
    And user click on submit button
    Then user verify current url userhome
    Then user click on dropdown box for profile
    Then user selects profile option
    Then user verify My Profile Text
    Then user verify back arrow button
    Then user verify home arrow button
    Then user verify label fullname
    Then user verify label fullname value
    Then user verify label fullname info
    Then user verify label fullname info value
    Then user click on back arrow button verify userhome page
    Then user verify current url userhome
    Then user click on dropdown box for profile
    Then user selects profile option
    Then user click on home arrow button verify userhome page
    Then user verify current url userhome
	
  @oidcLogin
  Scenario: User home page verification
    When user performs token-based login using Gmail refresh token
    And user enters the passcode "123456"
    And user click on submit button
    Then user verify home button
    And user verify stored cards button
    And user verify collapse button
    Then user click on collapse button
    And user verify if home headings are displayed
    Then user verify icons are visible
    Then user click on collapse button again
    And user verify profile details displayed
    And user verify profile image displayed
    And user verify profile name displayed
    And user verify dropdown displayed
    Then user click on dropdown box for profile
    And user verifies profile dropdown options are visible
    And user verifies "Profile" option is present in dropdown
    And user verifies "FAQ" option is present in dropdown
    And user verifies "Logout" option is present in dropdown
    And user click on dropdown box for profile again
    Then user sees a valid welcome message
    When user fetches highlight status of "Home" menu
    Then user verifies "Home" text is highlighted
    And user verifies "Home" icon is highlighted
    And user verifies visual bar is present near "Home"
    Then user click on stored credentials button
    And user verify current url usercredentials
    When user fetches highlight status of "Stored Cards" menu
    Then user verifies "Stored Cards" text is highlighted
    And user verifies "Stored Cards" icon is highlighted
    And user verifies visual bar is present near "Stored Cards"
    Then user click on dropdown box for profile
    And user click on FAQ link
    Then user verify current url faq

  @oidcLogin
  Scenario: User download card verification
    When user performs token-based login using Gmail refresh token
    And user enters the passcode "123456"
    And user click on submit button
    Then user click on stored credentials button
    Then user verify current url usercredentials
    Then user verify no cards stored message
    Then user verify substring when no cards stored
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
    And User enter the otp "111111"
    And User click on verify button
    Then user click on stored credentials button  
    Then User click on cards button
    And User search the issuers sunbird
    And User verify sunbird cridentials button
    And User click on sunbird cridentials button
    Then User verify list of credential types displayed
    And User verify sunbird rc insurance verifiable credential displayed
    And User click on sunbird rc insurance verifiable credential button
    And User enter the policy number
    And User enter the full name
    And User enter the date of birth
    And User click on login button
    Then user click on stored credentials button  
    Then User click on cards button
    And User search the issuers sunbird
    And User verify sunbird cridentials button
    And User click on sunbird cridentials button
    Then User verify list of credential types displayed
    And User verify life Insurance displayed
    And User click on life Insurance button
    And User verify policy number input box header
    And User enter the policy number
    And User verify full name input box header
    And User enter the full name
    And User verify date of birth input box header
    And User enter the date of birth
    And User click on login button
    Then user verifies card search functionality
	Then user verifies cards are in horizontal order
    Examples:
      | policy number | full name        | date of birth | Validity |
      | 1207205244    | automationtest1  | 01-01-2024     | 3        |

  @oidcLogin
  Scenario: Reset page verification
    When user performs token-based login using Gmail refresh token
    Then user verify forget passcode option
    Then user click on forget passcode option
    Then user verify the title of the window
    Then user verify the current url userresetpasscode
    Then user verify the back button
    Then user verify passcode reset info1 available
    Then user verify user info on resetpasscode available
    Then user verify forget passcode button
    Then user verify forget passcode button enabled
    Then user click on forget passcode button
    And user enters the passcode "111111"
    And user enters the passcode for confirmation "123455"
    And user click on submit button
    Then user prints verify message for mismatch
    And user enters the passcode for confirmation "111111"
    And user click on submit button
    Then user click on dropdown box for profile
    Then user click on logout button
    When user performs token-based login using Gmail refresh token
    And user enters the passcode "111111"
    And user click on submit button
    Then user verify current url userhome
    Then user click on stored credentials button
    Then user verify current url usercredentials
    Then user verify no cards stored message
    Then user verify substring when no cards stored