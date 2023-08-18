export class UserSettings {
    private storageKey: string;

    constructor(storageKey: string = 'userSettings') {
        this.storageKey = storageKey;

        // Initialize local storage with an empty object if it doesn't exist
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify({}));
        }
    }

    set(key: string, value: any): void {
        const settings = this.getAllSettings();
        settings[key] = value;
        localStorage.setItem(this.storageKey, JSON.stringify(settings));
    }

    get(key: string): any | null {
        const settings = this.getAllSettings();
        return settings.hasOwnProperty(key) ? settings[key] : null;
    }

    private getAllSettings(): { [key: string]: any } {
        const settings = localStorage.getItem(this.storageKey);
        return settings ? JSON.parse(settings) : {};
    }
}

export const DefaultUserSettings = new UserSettings("main");

// Usage:
// const settings = new UserSettings();
// settings.set('theme', 'dark');
// console.log(settings.get('theme')); // Outputs: dark
