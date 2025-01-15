## Overview

This is the docker-compose setup to run 

- **mimoto-service** which act as BFF for Inji mobile and backend for Inji web.
- **inji-web** for frontend

This is not for production use.

## Navigate to inji-web folder and Build the inji-web image locally.

> docker build -t inji-web:local .

## What is in the docker-compose folder?

1. certs folder holds the p12 file which is being created as part of OIDC client onboarding.
2. "config" folder holds the mimoto system properties file, issuer configuration, verifier configuration and credential template.
3. "docker-compose.yml" file with mimoto setup.

## How to run this setup?

1. Add Id providers as an issuer in mimoto-issuers-config.json

2. Add verifiers clientId and redirect Uri in mimoto-trusted-verifiers.json for Online Sharing

3. Start esignet services (authorisation server) or use existing esignet service deployed on cloud and update esignet host references in mimoto-default.properties and mimoto-issuers-config.json

4. Create certs folder in the same directory and create OIDC client. Add key in oidckeystore.p12 and copy this file under certs folder. Replace oidc_p12_password environment variable value by password provided in documentation.
Refer [here](https://docs.mosip.io/inji/inji-mobile-wallet/customization-overview/credential_providers) to create client
* Update client_id and client_alias as per onboarding in mimoto-issuers-config.json file.

5. Navigate to docker-compose folder and start the docker-compose file

> docker-compose up -d

6. Navigate to docker-compose folder and stop the docker-compose file

> docker-compose down

7. Access Apis as
   * http://localhost:8099/v1/mimoto/allProperties
   * http://localhost:8099/v1/mimoto/issuers
   * http://localhost:8099/v1/mimoto/issuers/StayProtected
   * http://localhost:8099/v1/mimoto/issuers/StayProtected/well-known-proxy


Note:
- Replace mosipbox.public.url, mosip.api.public.url with your public accessible domain. For dev or local env [ngrok](https://ngrok.com/docs/getting-started/) is recommended.
