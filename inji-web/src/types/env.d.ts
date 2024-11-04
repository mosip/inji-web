export {}

declare global {
    interface Window {
        _env_: {
            DEFAULT_LANG: string;
            DEFAULT_THEME: string;
            DEFAULT_FAVICON: string;
            DEFAULT_TITLE: string;
            DEFAULT_FONT_URL: string;
            MIMOTO_HOST: string;
        }
    }
}
