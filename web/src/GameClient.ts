import * as THREE from "three";
import { Lobby } from "./Scenes/Lobby.js";
import { WSClient } from "./WSClient/WSClient.js";
import { ScoreDisplay } from "./UI/ScoreDisplay.js";
import { TimerDisplay } from "./UI/TimerDisplay.js";
import { TaggedIndicator } from './UI/TaggedIndicator.js';
import { SettingsMenu } from "./UI/SettingsMenu.js";
import { DefaultUserSettings } from "./Utils/UserSettings.js";
import { LiveScoreDisplay } from "./UI/LiveScoreDisplay.js";
import { AudioPlayer } from "./Utils/AudioPlayer.js";
import { LoadingScreen } from "./UI/LoadingScreen.js";

export class GameClient {

    private isAdmin: boolean = false;
    private playerName: string = "";
    private playerScore: number = 0;
    private timeLeft = 0;

    private lobby: Lobby | null = null;
    private WSClient: WSClient | null = null;

    // UI
    private infoPanel: HTMLElement = document.getElementById("infoPanel") as HTMLElement;
    private liveScoreDisplay: LiveScoreDisplay | null = null;
    private timerDisplay: TimerDisplay | null = null;
    private taggedIndicator: TaggedIndicator = new TaggedIndicator();
    private settingsMenu = new SettingsMenu(DefaultUserSettings);
    private backgroundMusic: AudioPlayer | null = null;

    constructor() {
        document.addEventListener("keydown", (event) => {
            if (event.keyCode === 9) {
                event.preventDefault();
                this.settingsMenu.toggle();
                this.lobby?.ownerPlayer?.togglePointerControls();
            }
        });
    }

    public async startLobby(name: string) {
        console.log("Starting lobby");

        this.isAdmin = true;
        this.playerName = name;
        let loading = new LoadingScreen();
        loading.show();

        this.WSClient = await WSClient.create(name, this.spawnLobbyPlayer.bind(this));
        await this.WSClient.createLobby((lobbyId: string) => {
            this.lobby = new Lobby(
                this.playerName,
                lobbyId,
                true,
                this.settingsMenu,
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
                (tagged: string, tagger: string) => {
                    this.WSClient?.broadcastTagPlayer(tagged, tagger);
                },
                // On admin start game
                this.startGame.bind(this),
            );
            navigator.clipboard.writeText(lobbyId);
            setTimeout(() => {
                loading.hide();
            }, 1000);
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
            if (tagged === this.playerName) {
                this.taggedIndicator.show();
                this.lobby?.ownerPlayer?.stun(1);
            }
            if (tagger === this.playerName) {
                this.taggedIndicator.hide();
            }
        });
        this.WSClient.setOnScoreAndTimeCallback((scores: { name: string, score: number}[], time: number)=> {
            let thisPlayerScore = scores.find(s => s.name === this.playerName);
            this.liveScoreDisplay?.update(scores);

            this.setPlayerScore(thisPlayerScore?.score || 0);
            this.setGameTime(time);
            this.timerDisplay?.update(time);
        });
        this.WSClient.setOnGameStartedCallback(() => {
            this.timerDisplay = new TimerDisplay(60 * 3);
            this.liveScoreDisplay = new LiveScoreDisplay(this.lobby?.ownerPlayer?.getName()!);
            this.liveScoreDisplay.show();
        });
        this.WSClient.setOnEndGameCallback((scores: { name: string, score: number }[]) => {
            this.lobby?.gameOver(scores);
            this.liveScoreDisplay?.hide();
        });
    }

    public async joinLobby(name: string, lobbyId: string) {
        this.isAdmin = false;
        this.playerName = name;

        let loading = new LoadingScreen();
        loading.show();

        this.WSClient = await WSClient.create(name, this.spawnLobbyPlayer.bind(this));
        await this.WSClient.joinLobby(lobbyId, (id: string) => {
            console.log("Joined lobby", lobbyId);
            this.lobby = new Lobby(
                this.playerName,
                id,
                false,
                this.settingsMenu,
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
                (tagged: string, tagger: string) => {
                    this.WSClient?.broadcastTagPlayer(tagged, tagger);
                },
            )
            setTimeout(() => {
                loading.hide();
            }, 1000);
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
            if (tagged === this.playerName) {
                this.taggedIndicator.show();
                this.lobby?.ownerPlayer?.stun(1);
            }
            if (tagger === this.playerName) this.taggedIndicator.hide();
        });
        this.WSClient.setOnScoreAndTimeCallback((scores: { name: string, score: number}[], time: number)=> {
            let thisPlayerScore = scores.find(s => s.name === this.playerName);
            this.liveScoreDisplay?.update(scores);

            this.setPlayerScore(thisPlayerScore?.score || 0);
            this.setGameTime(time);
            this.timerDisplay?.update(time);
        });
        this.WSClient.setOnGameStartedCallback(() => {
            this.timerDisplay = new TimerDisplay(60 * 3);
            this.liveScoreDisplay = new LiveScoreDisplay(this.lobby?.ownerPlayer?.getName()!);
        });
        this.WSClient.setOnEndGameCallback((scores: { name: string, score: number }[]) => {
            this.lobby?.gameOver(scores);
            this.liveScoreDisplay?.hide();
        });
    }

    public startGame() {
        const confirm = window.confirm("Are you sure you want to start the game?");
        if (!confirm) return;
        if (!this.lobby) throw new Error("Lobby is null");

        this.WSClient?.broadcastStartGame();
    }

    public renderInfoPanel() {
        this.infoPanel.style.display = "block";
        // this.infoPanel.innerText = `
        //     Name: ${this.playerName}
        //     Score: ${this.getPlayerScore()}
        //     Time Left: ${this.getGameTime()}
        //     Admin: ${this.isAdmin}
        //     Tagged: ${this.lobby?.ownerPlayer?.getTagged() ? "Yes" : "No"}
        //     TO RUN - PRESS Left Shift
        //     ${this.isAdmin ? "TO START GAME - PRESS F2" : ""}
        // `
        this.infoPanel.innerText = `
            Name: ${this.playerName}
            ${this.isAdmin ? "TO START GAME - PRESS F2" : ""}
            `
    }

    public setPlayerScore(score: number) {
        this.playerScore = score;
    }

    public getPlayerScore() {
        return this.playerScore;
    }

    public setGameTime(time: number) {
        this.timeLeft = time;
    }

    public getGameTime() {
        return this.timeLeft;
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