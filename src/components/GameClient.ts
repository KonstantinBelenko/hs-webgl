import Game from "./Scenes/Game.js";
import Lobby from "./Scenes/Lobby.js";
import WSClient from "./WSClient.js";

export default class GameClient {

    private isAdmin: boolean = false;
    private playerName: string = "";

    private lobby: Lobby | null = null;
    private game: Game | null = null;
    private WSClient: WSClient | null = null;
    
    // UI
    private infoPanel: HTMLElement = document.getElementById("infoPanel") as HTMLElement;

    constructor() {

    }

    public startLobby(name: string) {
        this.isAdmin = true;
        this.playerName = name;

        this.WSClient = new WSClient(name);
        this.lobby = new Lobby(this.playerName, this.renderInfoPanel.bind(this));
    }

    public joinLobby(name: string, lobbyId: string) {
        // TODO: Implement
        this.isAdmin = false;
    }

    public startGame() {
        
    }

    public renderInfoPanel() {
        this.infoPanel.style.display = "block";
        this.infoPanel.innerText = `
            Name: ${this.playerName}
        `
    }

}