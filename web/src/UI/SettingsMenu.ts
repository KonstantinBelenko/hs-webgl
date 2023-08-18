import { UserSettings } from "../Utils/UserSettings.js";

export class SettingsMenu {
    private modal: HTMLDivElement;
    private slider: HTMLInputElement;
    private label: HTMLLabelElement | null = null;
    private userSettings: UserSettings;

    constructor(userSettings: UserSettings) {
        this.userSettings = userSettings;

        this.modal = document.createElement('div');
        this.modal.style.position = 'fixed';
        this.modal.style.top = '0';
        this.modal.style.left = '0';
        this.modal.style.width = '100vw';
        this.modal.style.height = '100vh';
        this.modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        this.modal.style.display = 'flex';
        this.modal.style.justifyContent = 'center';
        this.modal.style.alignItems = 'center';
        this.modal.style.zIndex = '1000';
        this.modal.style.opacity = '0';
        this.modal.style.transition = 'opacity 0.3s ease';
        this.modal.style.color = 'white';
        this.modal.style.pointerEvents = 'none'; // Initially not clickable

        // Create the slider for mouse sensitivity
        this.slider = document.createElement('input');
        this.slider.type = 'range';
        this.slider.min = '0.1';
        this.slider.max = '10';
        this.slider.step = '0.1';
        this.slider.value = '5'; // Default value
        this.slider.style.margin = '10px';
        this.slider.style.width = '300px';

        // Create a label for the slider
        const label = document.createElement('label');
        label.innerHTML = 'Mouse Sensitivity:';
        label.appendChild(this.slider);

        this.modal.appendChild(label);

        // Load the saved sensitivity value or default to 5
        const savedSensitivity = this.userSettings.get('mouseSensitivity') || '5';
        this.slider.value = savedSensitivity;

        // Update the label to show the current sensitivity value
        this.updateLabel();

        // Save the sensitivity value whenever the slider changes
        this.slider.addEventListener('input', () => {
            this.userSettings.set('mouseSensitivity', this.slider.value);
            this.updateLabel();

            document.dispatchEvent(new CustomEvent('mouseSensitivityChanged', {
                detail: {
                    mouseSensitivity: this.slider.value,
                }
            }));
        });

        document.body.appendChild(this.modal);

        // Close button
        const closeButton = document.createElement('button');
        closeButton.innerHTML = 'Close';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.style.padding = '10px';
        closeButton.style.borderRadius = '5px';
        closeButton.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', () => {
            this.close();
        });

        this.modal.appendChild(closeButton);
    }

    private updateLabel() {
        if (this.label) {
            this.label.innerHTML = `${this.slider.value}`;
            return;
        } else {
            this.label = document.createElement('label');
            this.label.innerHTML = `${this.slider.value}`;
            this.modal.appendChild(this.label);
        }
    }

    open() {
        this.modal.style.opacity = '1';
        this.modal.style.pointerEvents = 'all'; // Make it clickable
    }

    close() {
        this.modal.style.opacity = '0';
        this.modal.style.pointerEvents = 'none'; // Make it non-clickable
    }

    // Optional: Getter for the mouse sensitivity value
    getMouseSensitivity(): number {
        return this.userSettings.get('mouseSensitivity') || 5;
    }

    toggle() {
        if (this.modal.style.opacity === '0') {
            this.open();
        } else {
            this.close();
        }
    }

    isOpen(): boolean {
        return this.modal.style.opacity === '1';
    }
}

// Usage:
// const settingsMenu = new SettingsMenu();
// settingsMenu.open();
// settingsMenu.close();
