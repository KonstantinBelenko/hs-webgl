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
                true,
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
                this.renderInfoPanel.bind(this),
                // On player tagged someone
                (tagged: string, tagger: string) => this.WSClient?.broadcastTagPlayer(tagged, tagger),
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
        this.WSClient.setOnPlayerWasTagged((tagged: string, tagger: string) => {
            if (this.lobby) this.lobby.tagPlayer(tagged, tagger);
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
                false,
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
                // On player tagged someone
                (tagged: string, tagger: string) => this.WSClient?.broadcastTagPlayer(tagged, tagger),
            )
        })
        this.WSClient.setOnPlayerMoveResponse((name: string, location: THREE.Vector3, rotation: THREE.Euler) => {
            if (this.lobby) this.lobby.moveOtherPlayer(
                name,
                location,
                rotation,
            );
        });
        this.WSClient.setOnPlayerWasTagged((tagged: string, tagger: string) => {
            if (this.lobby) this.lobby.tagPlayer(tagged, tagger);
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
            Tagged: ${this.lobby?.ownerPlayer?.getTagged() ? "Yes" : "No"}
            TO RUN - PRESS Left Shift
        `
    }

    public spawnLobbyPlayer(
        player: {
            name: string,
            isTagged: boolean,
            location: { x: number, y: number, z: number },
            rotation: { x: number, y: number, z: number },
        }
    ) {
        if (!this.lobby) throw new Error("Lobby is null");
        this.lobby.spawnOtherPlayer(
            player.name,
            player.isTagged,
            new THREE.Vector3(player.location.x, player.location.y, player.location.z),
            new THREE.Euler(player.rotation.x, player.rotation.y, player.rotation.z),
        );
    }
}