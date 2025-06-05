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
    RESET_WALLET: "reset-wallet",
    PASSCODE: "passcode",
    AUTHORIZE: "authorize"
}

export const ROUTES = {
    ROOT: Pages.ROOT,
    PASSCODE: `/${Pages.USER}/${Pages.PASSCODE}`,
    USER_HOME: `/${Pages.USER}/${Pages.HOME}`,
    USER_ISSUERS: `/${Pages.USER}/${Pages.ISSUERS}`,
    USER_ISSUER: (id: string) => `/${Pages.USER}/${Pages.ISSUERS}/${id}`,
    ISSUER: (id: string) => `/${Pages.ISSUERS}/${id}`,
    CREDENTIALS: `/${Pages.USER}/${Pages.CREDENTIALS}`,
    PROFILE: `/${Pages.USER}.${Pages.PROFILE}`,
    FAQ: `/${Pages.FAQ}`,
    USER_FAQ: `/${Pages.USER}/${Pages.FAQ}`,
    USER_RESET_WALLET: `/${Pages.USER}/${Pages.RESET_WALLET}`,
};

