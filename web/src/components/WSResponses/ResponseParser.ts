import BaseResponse from "./baseResponse.js";
import LobbyCreatedResponse from "./roomCreatedResponse.js";
import SpawnObjectResponse from "./spawnObjectResponse.js";
import SpawnPlayerResponse from './spawnPlayerResponse.js';
import RoomJoinedResponse from './roomJoinedResponse.js';
import MoveObjectResponse from "./moveObjectResponse.js";
import MovePlayerResponse from "./movePlayerResponse.js";

export default class ResponseParser {

    private data: object;

    constructor(data: string) {
        this.data = JSON.parse(data);
    }

    public baseResponse(): BaseResponse {
        return this.data as BaseResponse;
    }

    public lobbyCreatedResponse(): LobbyCreatedResponse {
        return this.data as LobbyCreatedResponse;
    }

    public SpawnObjectResponse(): SpawnObjectResponse {
        return this.data as SpawnObjectResponse;
    }

    public SpawnPlayerResponse(): SpawnPlayerResponse {
        return this.data as SpawnPlayerResponse;
    }

    public RoomJoinedResponse(): RoomJoinedResponse {
        return this.data as RoomJoinedResponse;
    }

    public MoveObjectResponse(): MoveObjectResponse {
        return this.data as MoveObjectResponse;
    }

    public MovePlayerResponse(): MovePlayerResponse {
        return this.data as MovePlayerResponse;
    }

}