import Player from './Objects/Player.js';
import { ObjectTypes } from './Objects/objectTypes.js';
import WSRequest from './WSRequests/baseRequest.js';
import CreateRoomRequest from './WSRequests/createRoomRequest.js';
import JoinLobbyRequest from './WSRequests/joinLobbyRequest.js';
import MovePlayerRequest from './WSRequests/movePlayerRequest.js';
import SpawnPlayerRequest from './WSRequests/spawnPlayerRequest.js';
import ResponseParser from './WSResponses/ResponseParser.js';
import { ResponseType } from './WSResponses/responseTypes.js';
import SpawnPlayerResponse from './WSResponses/spawnPlayerResponse.js';
import * as THREE from 'three';

export default class WSClient {

    private websocket: WebSocket | null = new WebSocket("ws://localhost:8080/connect");
    private name: string = "";

    // Lobby management
    private isLobbyOwner: boolean = false;
    private lobbyId: string = "";
    private onLobbyCreated: Function | null = null;
    private onLobbyJoined: Function | null = null;
    private onPlayerSpawned: Function | null = null;
    private onPlayerMoveResponse: Function | null = null;
    
    constructor(name: string, onPlayerSpawned?: (playerResp: SpawnPlayerResponse) => void) {
        if (name.trim() === "") throw new Error("Name cannot be empty");

        this.name = name;
        this.onPlayerSpawned = onPlayerSpawned || null;
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
        let type = res.baseResponse().type;

        if (type === ResponseType.ROOM_CREATED) {
            let lobbyCreated = res.lobbyCreatedResponse();
            this.isLobbyOwner = true;
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
            if (this.onPlayerSpawned){
                this.onPlayerSpawned(spawnPlayer);
            }
        }

        if (type === ResponseType.MOVE_PLAYER) {
            let movePlayer = res.MovePlayerResponse();
            let location = new THREE.Vector3(movePlayer.location.x, movePlayer.location.y, movePlayer.location.z);
            let rotation = new THREE.Euler(movePlayer.rotation.x, movePlayer.rotation.y, movePlayer.rotation.z);

            if (this.onPlayerMoveResponse) this.onPlayerMoveResponse(movePlayer.name, location, rotation);
        }
    }

    private onClosed(data: CloseEvent) {
        console.log("Closed:", data);
    }

    private onError(error: Event) {
        console.log("Error:", error);
    }

    private send(req: WSRequest) {
        this.websocket!.send(JSON.stringify(req.get()));
    }

    public async createLobby(onLobbyCreated: Function) {
        this.onLobbyCreated = onLobbyCreated;
        this.send(new CreateRoomRequest(this.name));
    }

    public async joinLobby(lobbyId: string, onLobbyJoined: Function) {
        this.lobbyId = lobbyId;
        this.onLobbyJoined = onLobbyJoined;
        this.send(new JoinLobbyRequest(this.name, lobbyId));
    }

    public static async create(name: string, onPlayerSpawned?: (playerResp: SpawnPlayerResponse) => void) {
        const client = new WSClient(name, onPlayerSpawned);
        await client.init();
        return client;
    }

    public getLobbyId() {
        return this.lobbyId;
    }

    public broadcastOwnerSpawn(player: Player) {
        this.send(new SpawnPlayerRequest(
            this.lobbyId,
            player.getLocationVector(),
            player.getRotationVector(),
            player.getScaleVector(),
            ObjectTypes.PLAYER,
            player.getName(),
        ));
    }

    public broadcastMovePlayer(player: Player) {
        this.send(new MovePlayerRequest(
            this.lobbyId,
            ObjectTypes.PLAYER,
            player.getName(),
            player.getLocationVector(),
            player.getRotationVector(),
        ));
    }

    public setOnPlayerMoveResponse(onPlayerMove: (name: string, location: THREE.Vector3, rotation: THREE.Euler) => void) {
        this.onPlayerMoveResponse = onPlayerMove;
    }
}