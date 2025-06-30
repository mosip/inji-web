# Handling of User session expiration and re-authentication in Inji Web

## Overview

In case of the scenario where the logged in user's session has expired, and the user tries to perform an action that requires authentication. User is required to re-login again to continue.

## Flow of User session expiration and re-authentication


When an expired user tries to perform an action that requires authentication, 
the frontend will receive a 401 Unauthorized response from the backend. 
The frontend will then redirect the user to the passcode page, where they can re-authenticate. To capture this for multiple actions, an interceptor is used to handle the 401 Unauthorized response and redirect the user to login again.

### Technical Sequence Diagram

```mermaid
sequenceDiagram
    participant user as User
    participant fe as Inji Web
    participant interceptor as Inji Web Interceptor
    participant be as Mimoto Backend
    Note over fe, be: Any network request
    fe ->> interceptor: Make request
    interceptor ->> be: intercepts and Forward request
    be -->> interceptor: Response from backend
    interceptor ->> interceptor: Check if user is logged in
    alt isLoggedIn
        activate interceptor
        interceptor ->> interceptor: Check if response is unAuthorized
        alt [check] is unAuthorized
            activate fe
            rect rgb(255, 240, 230, 0.5)
                interceptor ->> fe: Redirect to passcode page <br/>(/ [location.state from will pass the current path])
                fe ->> user: User clicks on sign in with *
                fe ->> fe: Ask login - open root / [location.state will be as previous] Ask user to enter passcode
                user ->> fe: Perform login
                fe ->> fe: On successful login, <br/>return to location.state if present else to home page
            end
            note over fe: User is redirected to the page they were on before and user needs to re-trigger the action
            deactivate fe
        else [check] isAuthorized
            rect rgb(230, 255, 230, 0.4)
                interceptor ->> fe: Forward response
                note over fe: Continue with the response
            end
        end
        deactivate interceptor
    else guest mode
        rect rgb(230, 255, 230, 0.4)
            interceptor ->> fe: Forward response
            note over fe: Continue with the response
        end
    end
```


```mermaid
sequenceDiagram
    participant Browser
    participant ReactApp
    participant SpringSecurity
    participant CustomAuthRequestRepo
    participant OAuthProvider

    Browser->>ReactApp: Navigate to /dashboard
    ReactApp->>SpringSecurity: GET /dashboard (No token or expired)

    SpringSecurity-->>ReactApp: 302 Redirect to /oauth2/authorize
    SpringSecurity->>CustomAuthRequestRepo: saveAuthorizationRequest()

    note right of CustomAuthRequestRepo: Extract current route (/dashboard)\nand store it in session or cookie\nas `redirectTo`

    Browser->>OAuthProvider: Redirect to Auth server
    OAuthProvider->>Browser: Redirect back to /login/oauth2/code/{provider}

    Browser->>SpringSecurity: Request with code
    SpringSecurity->>CustomAuthRequestRepo: loadAuthorizationRequest()

    note right of CustomAuthRequestRepo: Load and remove `redirectTo`\nfrom session or cookie

    SpringSecurity->>SpringSecurity: OAuth2AuthenticationSuccessHandler invoked
    SpringSecurity->>SpringSecurity: Extract `redirectTo` from request/session
    SpringSecurity-->>Browser: Redirect to /dashboard (redirectTo)

    Browser->>ReactApp: Render /dashboard


```
## Storing of previous page url in session

When the user is asked for re-login due to session expiry while performing any authenticated action, the current page URL (or the page they were trying to access) is stored in the session storage. This allows the application to redirect the user back to that page after successful authentication.

##### Why Session Storage
- Session storage is a web storage mechanism that allows you to store data for the duration of the page session.
- Its lifecycle is tied to the browser tab, meaning it persists as long as the tab is open. And its persistent across page reloads and restores.
- It is accessible only within the same tab and not shared across tabs or windows.

```mermaid

sequenceDiagram
    participant be as Backend (Mimoto)
    participant interceptor as Frontend (Inji Web)<br/> Interceptor
    participant fe as Frontend (Inji Web)
    participant AppStorage
    participant user as User
    
    note over be, user: Scenario: User is logged in , session has expired, and user tries to access stored cards page
    
    user ->> fe: 1. Perform any protected action (e.g., open stored cards)
    fe ->> interceptor: 2. API call (eg., GET /wallets/wallet-id/credentials)
    interceptor ->> be: 3. Forward request to backend
    be ->> interceptor: 4. Reject with 401 Unauthorized
    interceptor ->> interceptor: 5. Check if user is logged in or fetching wallets
    note over interceptor: Reason for checking while fetching wallets is that,<br/>while fetching wallets only the session will be active but<br/>wallet will be in locked state (not loggged in)
    alt isLoggedIn || fetching wallets
        activate interceptor
        interceptor ->> AppStorage: 6.1 Store the current path in session storage <br/> (eg., /wallets/<wallet-id>/credentials)
        interceptor ->> fe: 6.2 Redirect to root (/) page <br/> (eg., /)
        fe ->> user: 7. User clicks on "Sign in with *"
        fe ->> user: 8. Open authentication page <br/> (/oauth2/authorize/google)
        user ->> fe: 9. User authenticates with OAuth provider
        fe ->> user: 10. Unlock Wallet (Passcode page)
        fe ->> AppStorage: 11. On successful unlock, get redirectTo
        fe ->> fe: 12. is redirectTo present?
        alt redirectTo Available in storage 
            fe ->> fe: 13. Redirect to redirectTo <br/> (eg., /wallets/<wallet-id>/credentials)
        else redirectTo Not Available in storage
            fe ->> fe: 13. Redirect to home page <br/> (eg., /home)
        end
    else guest mode
        rect rgb(230, 255, 230, 0.4)
            interceptor ->> fe: 6. Forward response
            note over fe: Continue with the response
        end
    end
```