export const KEYS = {
    USER: 'user',
    WALLET_ID: 'walletId',
};

// This constant exposes the pages used in the application. This will be used only by the Router component.
export const Pages = {
    ROOT: "/",
    USER: "user",
    HOME: "home",
    ISSUERS: "issuers",
    ISSUER_TEMPLATE: "issuers/:issuerId",
    CREDENTIALS: "credentials",
    PROFILE: "profile",
    FAQ: "faq",
    REDIRECT: "redirect",
    RESET_PASSCODE: "reset-passcode",
    PASSCODE: "passcode",
    AUTHORIZE: "authorize"
}

// This constant exposes the routes of the application which can be used across the component to avoid hardcoded navigation urls
export const ROUTES = {
    ROOT: Pages.ROOT,
    USER: `/${Pages.USER}`,
    PASSCODE: `/${Pages.USER}/${Pages.PASSCODE}`,
    USER_HOME: `/${Pages.USER}/${Pages.HOME}`,
    USER_ISSUERS: `/${Pages.USER}/${Pages.ISSUERS}`,
    ISSUERS: `/${Pages.ISSUERS}`,
    USER_ISSUER: (id: string) => `/${Pages.USER}/${Pages.ISSUERS}/${id}`,
    ISSUER: (id: string) => `/${Pages.ISSUERS}/${id}`,
    CREDENTIALS: `/${Pages.USER}/${Pages.CREDENTIALS}`,
    PROFILE: `/${Pages.USER}/${Pages.PROFILE}`,
    FAQ: `/${Pages.FAQ}`,
    USER_FAQ: `/${Pages.USER}/${Pages.FAQ}`,
    USER_RESET_PASSCODE: `/${Pages.USER}/${Pages.RESET_PASSCODE}`,
};