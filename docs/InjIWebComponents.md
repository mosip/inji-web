# **Inji Web Components**

<!-- TOC -->
* [**Inji Web Components**](#inji-web-components)
    * [**Inji Web**](#inji-web)
    * [**Mimoto**](#mimoto)
    * [**Inji Verify**](#inji-verify)
    * [**Inji Certify**](#inji-certify)
    * [**Data Share**](#data-share)
    * [**ESignet**](#esignet)
<!-- TOC -->

### **Inji Web**

- The Inji Web portal is a Web equivalent wallet, which lets you download the credentials in the PDF Format.
- The InjiWeb allows you a generate a QR code in the PDF itself.
- Currently Supports Two Different QR Codes
    - EmbeddedVC -> uses Pixel pass library to embed the complete VC within the QR
    - OnlineSharing -> QR Contains a authorize endpoint, which validates the VP and redirects the VP token to the caller.

### **Mimoto**

- Mimoto is a BFF(Backend for Frontend) for Inji Wallet. It's being used to get default configuration, download verifiable credentials (VC)
-   Mimoto Primarily Performs multiple Services like
    - Mimoto generates a keypair and signs the credential Request and invokes the VCI endpoint to the issuer's server for downloading the credential.
    - Mimoto Gives the List of Issuers Supported by the Web and Wallet through mimoto-issuers-config.json
    - Mimoto Allows you to verify the Verifiers List for Online Sharing through mimoto-trusted-verifiers.json
    - Mimoto Constructs the PDF for Download applying the details and designs from the Issuers Wellknown and downloaded Verifiable Credentials


### **Inji Verify**

- **Inji Verify** stands out as a robust verification tool specifically designed to validate the verifiable credentials encoded in QR codes through an intuitive web portal interface.
- Inji Verify can verify the Credential either via Scan or Upload Functionality
- Inji Verify Currently Supports Both the Type of QR Codes
    - EmbeddedVC
    - OnlineSharing


### **Inji Certify**

- Inji Certify lets organizations issue and manage verifiable credentials, empowering users with greater control over their data and access to services.
- Inji Certify Integrate with specific plugins to retrieve the data from the registry and convert the raw Data into verifiable Credential and Issues them to wallet to manage it.



### **Data Share**

- DataShare allows your to store and retreive the credentials for Online Sharing
- DataShare Runs on standalone mode to make it independent from PMS

### **ESignet**

- **eSignet** strives to provide a user-friendly and effective method for individuals to authenticate themselves and utilize online services while also having the option to share their profile information. Moreover, eSignet supports multiple modes of identity verification to ensure inclusivity and broaden access, thereby reducing potential digital barriers.
- Esignet Allows us to perform the authorization of the resident on the portal before downloading the credential
