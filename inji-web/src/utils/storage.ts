export class storage {
    static readonly SESSION_INFO = "download_session"
    static readonly SELECTED_LANGUAGE = "selected_language"

    static readonly setItem = (key: string, value: string) => {
        if (value) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }

    static readonly getItem = (key: string) => {
        let data = localStorage.getItem(key);
        if (data) {
            try {
                data = JSON.parse(data);
            } catch (e) {
                console.warn("Error parsing JSON from localStorage for key:", key, e);
                return data;
            }
        }
        return data;
    }

    static readonly removeItem = (key: string) => {
        localStorage.removeItem(key);
    }
}
