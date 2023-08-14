import { RequestType } from "./types/index.d.js";
import { ISpawnObjectRequest, SpawnObjectRequest } from './spawnObjcetRequest.js';
import { Vector3 } from "../types/index.d.js";

interface ISpawnPlayerRequest extends ISpawnObjectRequest {
    name: string;
}

export class SpawnPlayerRequest extends SpawnObjectRequest {

    private name: string;

    constructor(roomId: string, location: Vector3, rotation: Vector3, scale: Vector3, name: string) {
        super(roomId, location, rotation, scale, "player");
        this.name = name;
        this.setType(RequestType.SPAWN_PLAYER)
    }

    public override get(): ISpawnPlayerRequest {
        return {
            ...super.get(),
            name: this.name
        };
    }
}