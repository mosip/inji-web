export class Storage {
    static readonly SESSION_INFO = "download_session";
    static readonly SELECTED_LANGUAGE = "selected_language";

    static setItem = (key: string, value: string, windowSession: boolean = false): void => {
        if (value) {
            const storage = windowSession ? window.sessionStorage : localStorage;
            storage.setItem(key, JSON.stringify(value));
        }
    }

    static getItem = (key: string, windowSession: boolean = false): any => {
        const storage = windowSession ? window.sessionStorage : localStorage;
        let data = storage.getItem(key);

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

    static removeItem = (key: string, windowSession: boolean = false): void => {
        const storage = windowSession ? window.sessionStorage : localStorage;
        storage.removeItem(key);
    }
}