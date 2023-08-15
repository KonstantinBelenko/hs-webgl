import BaseRequest from "./baseRequest";
import CreateLobbyRequest from "./createRoomRequest";
import JoinRoomRequest from "./joinRoomRequest";
import { SpawnObjectRequest } from './spawnObjectRequest';
import { SpawnPlayerRequest } from './spawnPlayerRequest';
import MoveObjectRequest from './moveObjectRequest';
import MovePlayerRequest from './movePlayerRequest';
import { TagPlayerRequest } from "./tagPlayerRequest";

export default class RequestParser {

    private data: object;

    constructor(data: string) {
        this.data = JSON.parse(data);
    }

    public baseRequest(): BaseRequest {
        return this.data as BaseRequest;
    }

    public createLobbyRequest(): CreateLobbyRequest {
        return this.data as CreateLobbyRequest;
    }

    public joinLobbyRequest(): JoinRoomRequest {
        return this.data as JoinRoomRequest;
    }

    public SpawnObjectRequest(): SpawnObjectRequest {
        return this.data as SpawnObjectRequest;
    }

    public SpawnPlayerRequest(): SpawnPlayerRequest {
        return this.data as SpawnPlayerRequest;
    }

    public MoveObjectRequest(): MoveObjectRequest {
        return this.data as MoveObjectRequest;
    }

    public MovePlayerRequest(): MovePlayerRequest {
        return this.data as MovePlayerRequest;
    }

    public TagPlayerRequest(): TagPlayerRequest {
        return this.data as TagPlayerRequest;
    }

}