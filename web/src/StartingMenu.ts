export class StartingMenu {
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
        const userValues = this.getValuesFromParams();
        if (userValues != null) {
            this.hideStartForm();
            if (userValues.roomId == "") {
                runOnStart(userValues.name);
            } else {
                runOnJoin(userValues.name, userValues.roomId);
            }
        } else {
            this.startForm.addEventListener('submit', (event) => {
                event.preventDefault();
                // Get user values submitted with the form
                const userValues = this.getValuesFromForm();

                // If the user values are not null, hide the start form and run the callback
                if (userValues != null) {
                    this.hideStartForm();
                    if (userValues.roomId == "") {
                        runOnStart(userValues.name);
                    } else {
                        runOnJoin(userValues.name, userValues.roomId);
                    }
                } else {
                    alert("Please enter a name and a room ID");
                }
            });
        }
    }

    public hideStartForm() {
        this.startForm.style.display = 'none';
    }

    private getValuesFromParams(): { name: string, roomId: string} | null {
        const urlParams = new URLSearchParams(window.location.search);
        const nameParam = urlParams.get('name');
        const roomIdParam = urlParams.get('roomId');
        if (nameParam == null || roomIdParam == null || nameParam == "") {
            return null;
        }
        return {
            name: nameParam,
            roomId: roomIdParam
        }
    }

    private getValuesFromForm(): { name: string, roomId: string } | null {
        const nameInput = document.getElementById('name') as HTMLInputElement;
        const roomIdInput = document.getElementById('roomId') as HTMLInputElement;
        if (nameInput == null || roomIdInput == null || nameInput.value == "") {
            throw new Error("Could not find nameInput element");
        }
        return {
            name: nameInput.value,
            roomId: roomIdInput.value
        }
    }
}