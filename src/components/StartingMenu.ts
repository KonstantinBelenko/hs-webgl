export default class StartingMenu {
    // TODO: Add a way to join a lobby

    private startForm: HTMLElement;

    constructor(runOnStart: (name: string) => void, runOnJoin: (name: string, lobbyId: string) => void) {
        // Get the start form
        let _startForm = document.getElementById('startForm');
        if (_startForm == null) {
            throw new Error("Could not find startForm element");
        }
        this.startForm = _startForm;

        // Check if the user has a nickname in the URL
        const nameParam = this.getNameFromParams();
        if (nameParam) {
            this.hideStartForm();
            runOnStart(nameParam);

        } else {
            this.startForm.addEventListener('submit', (event) => {
                event.preventDefault();
                const name = this.getNameFromForm();
                this.hideStartForm();
                runOnStart(name);
            });
        }
    }

    private hideStartForm() {
        this.startForm.style.display = 'none';
    }

    private getNameFromParams(): string | null {
        const urlParams = new URLSearchParams(window.location.search);
        const nameParam = urlParams.get('name');
        return nameParam;
    }

    private getNameFromForm(): string {
        const nameInput = document.getElementById('name') as HTMLInputElement;
        if (nameInput == null) {
            throw new Error("Could not find nameInput element");
        }
        return nameInput.value;
    }
}