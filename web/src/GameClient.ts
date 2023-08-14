import * as THREE from "three";
import { Game } from "./Scenes/Game.js";
import { Lobby } from "./Scenes/Lobby.js";
import { WSClient } from "./WSClient/WSClient.js";

export class GameClient {

    private isAdmin: boolean = false;
    private playerName: string = "";

    private lobby: Lobby | null = null;
    private game: Game | null = null;
    private WSClient: WSClient | null = null;
    
    // UI
    private infoPanel: HTMLElement = document.getElementById("infoPanel") as HTMLElement;

    constructor() {}

    public async startLobby(name: string) {
        console.log("Starting lobby");
        this.isAdmin = true;
        this.playerName = name;

        this.WSClient = await WSClient.create(name, this.spawnLobbyPlayer.bind(this));
        await this.WSClient.createLobby((lobbyId: string) => {
            this.lobby = new Lobby(
                this.playerName,
                lobbyId,
                // On owner spawn
                player => this.WSClient?.broadcastOwnerSpawn(
                    player.getLocationVector(),
                    player.getRotationVector(),
                    player.getScaleVector(),
                    player.getName(),
                ),
                // On player move
                player => this.WSClient?.broadcastMovePlayer(
                    player.getLocationVector(),
                    player.getRotationVector(),
                    player.getName(),
                ),
                // On animate
                this.renderInfoPanel.bind(this)
            );
            navigator.clipboard.writeText(lobbyId);
        });
        this.WSClient.setOnPlayerMoveResponse((name: string, location: THREE.Vector3, rotation: THREE.Euler) => {
            if (this.lobby) this.lobby.moveOtherPlayer(
                name,
                location,
                rotation,
            );
        });
    }

    public async joinLobby(name: string, lobbyId: string) {
        this.isAdmin = false;
        this.playerName = name;

        this.WSClient = await WSClient.create(name, this.spawnLobbyPlayer.bind(this));
        await this.WSClient.joinLobby(lobbyId, (id: string) => {
            console.log("Joined lobby", lobbyId);
            this.lobby = new Lobby(
                this.playerName,
                id,
                // On owner spawn
                player => this.WSClient?.broadcastOwnerSpawn(
                    player.getLocationVector(),
                    player.getRotationVector(),
                    player.getScaleVector(),
                    player.getName(),
                ),
                // On player move
                player => this.WSClient?.broadcastMovePlayer(
                    player.getLocationVector(),
                    player.getRotationVector(),
                    player.getName(),
                ),
                this.renderInfoPanel.bind(this),
            )
        })
        this.WSClient.setOnPlayerMoveResponse((name: string, location: THREE.Vector3, rotation: THREE.Euler) => {
            if (this.lobby) this.lobby.moveOtherPlayer(
                name,
                location,
                rotation,
            );
        });
    }

    public startGame() {
        // TODO: Implement
    }

    public renderInfoPanel() {
        this.infoPanel.style.display = "block";
        this.infoPanel.innerText = `
            Name: ${this.playerName}
            Admin: ${this.isAdmin}
        `
    }

    public spawnLobbyPlayer(
        player: {
            name: string, 
            location: { x: number, y: number, z: number },
            rotation: { x: number, y: number, z: number },
        }
    ) {
        if (!this.lobby) throw new Error("Lobby is null");
        this.lobby.spawnOtherPlayer(
            player.name,
            new THREE.Vector3(player.location.x, player.location.y, player.location.z),
            new THREE.Euler(player.rotation.x, player.rotation.y, player.rotation.z),
        );
    }

}