import { Vector3 } from "../types/index.d.js";
import { ISpawnObjectResponse, SpawnObjectResponse } from "./spawnObjectResponse.js";
import { ResponseType } from "./types/index.d.js";

interface ISpawnPlayerResponse extends ISpawnObjectResponse {
    name: string;
}

export class SpawnPlayerResponse extends SpawnObjectResponse {

    public name: string;

    constructor(location: Vector3, rotation: Vector3, scale: Vector3, id: string, name: string) {
        super(location, rotation, scale, id);
        this.name = name;

        this.setType(ResponseType.SPAWN_PLAYER);
    }

    public override get(): ISpawnPlayerResponse {
        return {
            ...super.get(),
            name: this.name
        };
    }

}