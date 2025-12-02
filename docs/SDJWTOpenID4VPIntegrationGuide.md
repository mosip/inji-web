
# Inji Web Wallet : SD-JWT Verifiable Credential Sharing (OpenID4VP)

The existing OpenID4VP flow in Inji Web wallet supports only W3C Data Model 1.1 JSON-LD VCs. This document provides further extension to the capability of Inji Web to share SD-JWT VCs also.

## 13. Technical Specification

* **Key actors:** Verifier, User, INJI Web (wallet UI), Mimoto (wallet backend), Inji-openid4vp JAR, PostgreSQL Database.
* The **Verifier** redirects the **User** to INJI Web’s **/authorize** endpoint with OpenID4VP parameters.
* **INJI Web** handles login, datashare-param checks, and trust prompts, then calls Mimoto’s wallet APIs.
* **Mimoto** receives the request through **POST /wallets/{walletId}/presentations**, validates the verifier, and caches the presentation context.
* INJI Web fetches credential options via **GET /wallets/{walletId}/presentations/{presentationId}/credentials**.
* When the user submits, InjiWeb calls **PATCH /wallets/{walletId}/presentations/{presentationId}** with selected credentials.
* **Mimoto** constructs and signs the VP token, then sends it to the verifier’s **response_uri**.
* Mimoto stores success/error status in the **Database** based on the verifier’s response.
* If the user rejects, InjiWeb issues a PATCH error update, and Mimoto notifies the verifier accordingly.


### Detailed Integration Flow

```mermaid
sequenceDiagram
    autonumber
    participant Verifier
    participant User
    participant InjiWeb
    participant Mimoto
    participant Inji-openid4vp JAR
    participant Database(PostgreSQL)

    User->>Verifier: Initiate credential sharing flow
    Verifier->>InjiWeb: Redirect user to /authorize with required params
    InjiWeb->>InjiWeb: Check for datashare param
    alt datashare param exists
        InjiWeb->>InjiWeb: Continue datashare flow
    else datashare param missing
        InjiWeb->>InjiWeb: Redirect to /user/authorize (preserve params)
    end

    User->>InjiWeb: Access /user/authorize
    InjiWeb->>User: Prompt login if not authenticated
    User->>InjiWeb: Login

    InjiWeb->>Mimoto: POST /wallets/{walletId}/presentations (OpenID4VP params)
    Mimoto->>Inji-openid4vp JAR: authenticateVerifier(), parse request
    Inji-openid4vp JAR-->> Mimoto: presentation_definition, verifier info
    Mimoto->> Mimoto: Cache request context by presentation_id
    Mimoto->> Database(PostgreSQL): Get trusted verifiers for the user
    Database(PostgreSQL) -->> Mimoto: Trusted verifiers
    Mimoto-->>InjiWeb: Return verifier info, claims, is_trusted

    InjiWeb->>User: Prompt trust if verifier not trusted
    User->>InjiWeb: User accepts
    InjiWeb->>Mimoto: POST /wallets/{walletId}/trusted-verifiers
    Mimoto->>Database(PostgreSQL): Store trusted verifier

    InjiWeb->>Mimoto: GET /wallets/{walletId}/presentations/{presentation_id}/credentials

    Mimoto->>Database(PostgreSQL): Fetch credentials for the user
     Database(PostgreSQL) -->> Mimoto: User's Credentials
    Mimoto->>Mimoto: Match credentials
    Mimoto-->>InjiWeb: Return available/matching credentials and sdClaims (applicable for vc+sd-jwt)

    User->>InjiWeb: Select credentials, sdClaims (applicable for vc+sd-jwt) to submit
    InjiWeb->>Mimoto: PATCH /wallets/{walletId}/presentations/{presentation_id} (selected credentials, selected claims)
    Mimoto->>Database(PostgreSQL): Fetch credentials by ID
    Database-->>Mimoto: Return credentials
    Mimoto->>Mimoto: Prepare vc+sd-jwt credentials for presentation, <br /> add disclosures for claim selections
    Mimoto->>Inji-openid4vp JAR: constructUnsignedVPToken()
    Inji-openid4vp JAR-->>Mimoto: Unsigned VP Token
    Mimoto->>Mimoto: Sign VP token
    Mimoto->>Inji-openid4vp JAR: sendVPResponseToVerifier() (POST to response_uri)
    Inji-openid4vp JAR-->>Verifier: POST VP token to verifier
    Verifier-->>Inji-openid4vp JAR: response
    alt Submission result
        Inji-openid4vp JAR-->>Mimoto: Success
        Mimoto->>Database(PostgreSQL): Store presentation record (status=success)
        Mimoto-->>InjiWeb: Notify success
    else Error
        Inji-openid4vp JAR-->>Mimoto: Error
        Mimoto->>Database(PostgreSQL): Store presentation record (status=error)
        Mimoto-->>InjiWeb: Notify error
    end

    Inji-openid4vp JAR-->>Mimoto: verifier response
    Mimoto-->>InjiWeb: Send redirect_uri
    InjiWeb->>InjiWeb: Show result to user
    alt redirect_uri from verifier response exists
        InjiWeb->>Verifier: Redirect to redirect_uri
    else redirect_uri not present
        InjiWeb->>InjiWeb: Redirect to wallet home page
    end
```

## Changes required to support SD-JWT credential sharing 

#### Step 20 : Credential Matching

`GET /wallets/{walletId}/presentations/{presentation_id}/credentials`

- Support parsing of SD-JWT credentials and matching against input_descriptors.
- Use Authlete library to parse the sd-jwt VC, reference code already present in the `CredentialPDFGeneratorService` class.
- No proof type validation required for the vc+sd-jwt format.
- If sd-jwt_alg_values field is present in `input_descriptors -> format -> vc+sd-jwt -> sd-jwt_alg_values` , validate if VC's `alg` header is present in it during matching. Reference code from mobile wallet : [alg validation](https://github.com/mosip/inji-wallet/blob/d67a6054ed45b07710bc1bea621aa4566b4a6fad/machines/openID4VP/openID4VPActions.ts#L372)
- New **optional** field `sdClaims` to be returned for vc+sd-jwt format credential :

  ```json
  {
    "availableCredentials": [
      {
        "credentialId": "cred-123",
        "credentialTypeDisplayName": "W3C VC",
        "credentialTypeLogo": "https://mosip.github.io/inji-config/logos/mosipid-logo.png",
        "format": "ldp_vc"
      },
      {
        "credentialId": "cred-1234",
        "credentialTypeDisplayName": "SD-JWT VC",
        "credentialTypeLogo": "https://mosip.github.io/inji-config/logos/mosipid-logo.png",
        "format": "vc+sd-jwt",
        "sdClaims": ["name", "age", "gender"]
      }
    ],
    "missingClaims": [
      "$.type"
    ]
  }
  ```

  **Note:** `sdClaims` will hold disclosures available in the sd-jwt VC.

#### Step 25 : Selection of credentials and submission

- The user will select the credentials to share from the UI (Inji web), for vc+sd-jwt they will get an additional prompt to select the disclosure claims too to share. The credential IDs and corresponding claims will be sent to mimoto endpoint for submission.


#### Step 26 - 32 : Submission of credentials to Verifier

`PATCH /wallets/{walletId}/presentations/{presentation_id}`

- Accept selected credentials list as input along with selected sdClaims for vc+sd-jwt credentials. New optional field `selectedSdClaims` introduced to accept selected sdClaims :

  ```json
  {
    "selectedCredentials": ["cred-123", "cred-456"],
    "selectedSdClaims": {
      "cred-123": ["name", "age"]
    }
  }
  ```
- For vc+sd-jwt credentials, match the corresponding claims from `selectedSdClaims` and keep only those disclosures in the final VC.
- Generate unsigned VP token using the Inji OpenID4VP library
- Add capability to sign VP token for sd-jwt credentials, reference code : [Mobile Wallet sd-jwt signing logic](https://github.com/mosip/inji-wallet/blob/d67a6054ed45b07710bc1bea621aa4566b4a6fad/machines/openID4VP/openID4VPServices.ts#L84)

## References

- [OpenID for Verifiable Presentations - draft 23](https://openid.net/specs/openid-4-verifiable-presentations-1_0-ID3.html)
- [INJI OpenID4VP jar ReadMe](https://github.com/mosip/inji-openid4vp/blob/master/README.md)
- [Mimoto API Documentation](https://mosip.stoplight.io/docs/mimoto)
