import { BaseRequest } from './Requests/baseRequest.js';
import { CreateRoomRequest } from './Requests/createRoomRequest.js';
import { JoinRoomRequest } from './Requests/joinRoomRequest.js';
import { MovePlayerRequest } from './Requests/movePlayerRequest.js';
import { SpawnPlayerRequest } from './Requests/spawnPlayerRequest.js';
import { ResponseParser } from './Responses/ResponseParser.js';
import { SpawnPlayerResponse } from './Responses/spawnPlayerResponse.js';
import * as THREE from 'three';
import { ResponseType } from './Responses/types/index.d.js';
import { Vector3 } from './types/index.d.js';
import { TagPlayerRequest } from './Requests/tagPlayerRequest.js';
import { StartGameRequest } from './Requests/startGameRequest.js';

export class WSClient {

    private websocket: WebSocket | null = new WebSocket("wss://black-meadow-2733.fly.dev/connect");
    // private websocket: WebSocket | null = new WebSocket("ws://localhost:8080/connect");
    private name: string = "";

    // Lobby management
    private lobbyId: string = "";

    // Callbacks
    private onLobbyCreated: Function | null = null;
    private onLobbyJoined: Function | null = null;
    private onPlayerSpawnedCallback: Function | null = null;
    private onPlayerMoveCallback: Function | null = null;
    private onPlayerWasTaggedCallback: Function | null = null;
    private onGameStartedCallback: Function | null = null;
    private onScoreAndTimeCallback: Function | null = null;
    private onEndGameCallback: Function | null = null;

    constructor(name: string, onPlayerSpawnedCallback?: (playerResp: SpawnPlayerResponse) => void) {
        if (name.trim() === "") throw new Error("Name cannot be empty");

        this.name = name;
        this.onPlayerSpawnedCallback = onPlayerSpawnedCallback || null;
        this.init();
    }

    public init(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.websocket!.onopen = () => {
                this.onOpen();
                resolve();
            };
            this.websocket!.onmessage = this.onMessage.bind(this);
            this.websocket!.onclose = this.onClosed.bind(this);
            this.websocket!.onerror = (err) => {
                this.onError(err);
                reject(err);
            };
        });
    }

    private onOpen() {
        console.log("Connected to server");
    }

    private onMessage(event: MessageEvent) {
        let res = new ResponseParser(event.data);
        let type = res.BaseResponse().type;

        if (type === ResponseType.ROOM_CREATED) {
            let lobbyCreated = res.RoomCreatedResponse();
            this.lobbyId = lobbyCreated.roomId;
            if (this.onLobbyCreated) this.onLobbyCreated(lobbyCreated.roomId);
        }

        if (type === ResponseType.ROOM_JOINED) {
            let lobbyJoined = res.RoomJoinedResponse(); 
            this.lobbyId = lobbyJoined.roomId;
            if (this.onLobbyJoined) this.onLobbyJoined(lobbyJoined.roomId);
        }

        if (type === ResponseType.SPAWN_PLAYER) {
            console.log("Spawning player");
            let spawnPlayer = res.SpawnPlayerResponse();
            if (this.onPlayerSpawnedCallback){
                this.onPlayerSpawnedCallback(spawnPlayer);
            }
        }

        if (type === ResponseType.MOVE_PLAYER) {
            let movePlayer = res.MovePlayerResponse();
            let location = new THREE.Vector3(movePlayer.location.x, movePlayer.location.y, movePlayer.location.z);
            let rotation = new THREE.Euler(movePlayer.rotation.x, movePlayer.rotation.y, movePlayer.rotation.z);

            if (this.onPlayerMoveCallback) this.onPlayerMoveCallback(movePlayer.name, location, rotation);
        }

        if (type === ResponseType.TAG_PLAYER) {
            console.log("Player was tagged: ", res.TagPlayerResponse());
            let data = res.TagPlayerResponse();
            if (this.onPlayerWasTaggedCallback) {
                this.onPlayerWasTaggedCallback(data.taggedPlayerName, data.taggerPlayerName)
            }
        }

        if (type === ResponseType.START_GAME) {
            console.log("Game started");
            if (this.onGameStartedCallback) this.onGameStartedCallback();
        }

        if (type === ResponseType.SCORE_AND_TIME) {
            console.log("Score and time");
            let data = res.ScoreAndTimeResponse();
            if (this.onScoreAndTimeCallback) this.onScoreAndTimeCallback(
                data.score,
                data.time,
            );
        }

        if (type === ResponseType.END_GAME) {
            console.log("Game ended");
            let data = res.EndGameResponse();
            if (this.onEndGameCallback) this.onEndGameCallback(data.scores);
        }
    }

    private onClosed(data: CloseEvent) {
        console.log("Closed:", data);
    }

    private onError(error: Event) {
        console.log("Error:", error);
    }

    private send(req: BaseRequest) {
        this.websocket!.send(JSON.stringify(req.get()));
    }

    public async createLobby(onLobbyCreated: Function) {
        this.onLobbyCreated = onLobbyCreated;
        this.send(new CreateRoomRequest(this.name));
    }

    public async joinLobby(lobbyId: string, onLobbyJoined: Function) {
        this.lobbyId = lobbyId;
        this.onLobbyJoined = onLobbyJoined;
        this.send(new JoinRoomRequest(this.name, lobbyId));
    }

    public static async create(name: string, onPlayerSpawned?: (playerResp: SpawnPlayerResponse) => void) {
        const client = new WSClient(name, onPlayerSpawned);
        await client.init();
        return client;
    }

    public getLobbyId() {
        return this.lobbyId;
    }

    public broadcastOwnerSpawn(location: Vector3, rotation: Vector3, scale: Vector3, name: string) {
        this.send(new SpawnPlayerRequest(
            this.lobbyId,
            location,
            rotation,
            scale,
            name,
        ));
    }

    public broadcastMovePlayer(location: Vector3, rotation: Vector3, name: string) {
        this.send(new MovePlayerRequest(
            this.lobbyId,
            name,
            location,
            rotation,
        ));
    }

    public broadcastTagPlayer(taggedName: string, taggerName: string) {
        this.send(new TagPlayerRequest(
            this.lobbyId,
            taggedName,
            taggerName,
        ))
    }

    public broadcastStartGame() {
        this.send(new StartGameRequest( this.lobbyId ))
    }

    public setOnPlayerMoveResponse(onPlayerMove: (name: string, location: THREE.Vector3, rotation: THREE.Euler) => void) {
        this.onPlayerMoveCallback = onPlayerMove;
    }

    public setOnPlayerWasTagged(onPlayerWasTaggedCallback: (taggedName: string, taggerName: string) => void) {
        this.onPlayerWasTaggedCallback = onPlayerWasTaggedCallback;
    }

    public setOnGameStartedCallback(onGameStarted: () => void) {
        this.onGameStartedCallback = onGameStarted;
    }

    public setOnScoreAndTimeCallback(onScoreAndTime: (score: number, time: number) => void) {
        this.onScoreAndTimeCallback = onScoreAndTime;
    }

    public setOnEndGameCallback(onEndGame: (scores: { name: string, score: number }[]) => void) {
        this.onEndGameCallback = onEndGame;
    }

}