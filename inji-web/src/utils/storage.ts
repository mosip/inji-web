// storage.ts
export const storage = {
    SESSION_INFO: 'SESSION_INFO',
    SELECTED_LANGUAGE: 'selectedLanguage',
  
    setItem(key: string, value: any): void {
      if (value !== undefined) {
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
          console.error('Error setting item in localStorage:', error);
        }
      }
    },
  
    getItem(key: string): any {
      try {
        const item = localStorage.getItem(key);
        return item !== null ? JSON.parse(item) : null;
      } catch (error) {
        console.error('Error getting item from localStorage:', error);
        return null;
      }
    },
  
    removeItem(key: string): void {
      localStorage.removeItem(key);
    },
  
    clear(): void {
      localStorage.clear();
    }
  };