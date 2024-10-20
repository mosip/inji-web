
export class storage {
    static SESSION_INFO = "download_session";
    static SELECTED_LANGUAGE = "selected_language";

    static setItem = (key: string, value: string | null | undefined) => {
        if (value !== null && value !== undefined) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }

    static getItem = (key: string): string | null => {
        const data = localStorage.getItem(key);
        if (data) {
            try {
                return JSON.parse(data);
            } catch (error) {
                return null;
            }

        }
        return null;
    }
}