export class AppStorage {
    static readonly SESSION_INFO = "download_session";
    static readonly SELECTED_LANGUAGE = "selected_language";

    private static getStorageEngine(windowSession: boolean) {
        return windowSession ? window.sessionStorage : localStorage;
    }

    static readonly setItem = (key: string, value: string, windowSession: boolean = false): void => {
        if (value) {
            this.getStorageEngine(windowSession).setItem(key, JSON.stringify(value));
        }
    }

    static readonly getItem = (key: string, windowSession: boolean = false): any => {
        let data = this.getStorageEngine(windowSession).getItem(key);

        if (data) {
            try {
                return JSON.parse(data);
            } catch (e) {
                console.warn(`Error parsing JSON from storage for key: ${key}`, e);
                return data;
            }
        }
        return data;
    }

    static readonly removeItem = (key: string, windowSession: boolean = false): void => {
        this.getStorageEngine(windowSession).removeItem(key);
    }
}