import { BaseResponse } from "./baseResponse.js";
import { RoomCreatedResponse } from "./roomCreatedResponse.js";
import { SpawnObjectResponse } from "./spawnObjectResponse.js";
import { SpawnPlayerResponse } from './spawnPlayerResponse.js';
import { RoomJoinedResponse } from './roomJoinedResponse.js';
import { MoveObjectResponse } from "./moveObjectResponse.js";
import { MovePlayerResponse } from "./movePlayerResponse.js";

export class ResponseParser {

    private data: object;

    constructor(data: string) {
        this.data = JSON.parse(data);
    }

    public BaseResponse(): BaseResponse {
        return this.data as BaseResponse;
    }

    public RoomCreatedResponse(): RoomCreatedResponse {
        return this.data as RoomCreatedResponse;
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