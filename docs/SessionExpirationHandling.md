# Handling of User session expiration and re-authentication in Inji Web

## Overview

In case of the scenario where the logged-in user's session has expired, and the user tries to perform an action that requires authentication. User is required to re-login again to continue.

## Flow of User session expiration and re-authentication


In an expired session when user tries to perform an action that requires authentication, 
the frontend will receive a 401 Unauthorized response from the backend. 
The frontend will then redirect the user to the root page, where they can re-authenticate by clicking `Login with *`. To capture this for multiple actions, an interceptor is used to handle the 401 Unauthorized response and redirect the user to login again.

## Storing of previous page url in session

When the user is asked for re-login due to session expiry while performing any authenticated action, the current page URL (or the page they were trying to access) is stored in the session storage. This allows the application to redirect the user back to that page after successful authentication.

##### Why Session Storage
- Session storage is a web storage mechanism that allows you to store data for the duration of the page session.
- Its lifecycle is tied to the browser tab, meaning it persists as long as the tab is open. And its persistent across page reloads and restores.
- It is accessible only within the same tab and not shared across tabs or windows.

## Technical Sequence Diagram

Actors involved:
1. **Backend** (Mimoto) - Handles API requests and responses.
2. **Frontend Interceptor** - Intercepts API calls and handles session management.
3. **Frontend** (Inji Web) - The user interface that interacts with the backend.
4. **AppStorage** - Manages session storage & local storage for the application.
5. **User** - The end user interacting with the application.

```mermaid

sequenceDiagram
    participant be as Backend (Mimoto)
    participant interceptor as Frontend<br/> Interceptor
    participant fe as Frontend (Inji Web)
    participant AppStorage
    participant user as User
    
    note over be, user: Scenario: User is logged in , session has expired,<br/> and user tries to access any protected page (Eg - stored cards)
    
    user ->> fe: 1. Perform any protected action (e.g., open stored cards)
    fe ->> interceptor: 2. API call (eg., GET /wallets/wallet-id/credentials)
    interceptor ->> be: 3. Forward request to backend
    be ->> interceptor: 4. Reject with <br/> 401 Unauthorized response (due to session expiration)
    interceptor ->> interceptor: 5. Check if <br/> is logged in (as per frontend: user available in AppStorage)<br/> or <br/> session active (as per frontend: walletId available in AppStorage)
    note over interceptor: Reason for checking<br/>1. client is logged in - Only for logged in users re-login should be prompted if session expires<br/>2. If user session is active - For flows like Create wallet / fetch wallet etc, where user is not logged in but session is active, <br/>we should prompt for re-login in case session expires.
    alt isLoggedIn || isSessionActive
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

### Key Definitions

```
Logged-in user = Authentication via Provider (session active) + Unlocked wallet using Passcode.
```

- **isLoggedIn**: A boolean flag indicating whether the user logged in, tracked in frontend.
- **isSessionActive**: A boolean flag indicating whether the user session is active, tracked in frontend.
- **redirectTo**: A string representing the URL to redirect the user after successful authentication, stored in session storage.