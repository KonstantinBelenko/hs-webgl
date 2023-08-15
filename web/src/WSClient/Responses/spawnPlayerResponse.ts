import { Vector3 } from "../types/index.d.js";
import { ISpawnObjectResponse, SpawnObjectResponse } from "./spawnObjectResponse.js";
import { ResponseType } from "./types/index.d.js";

interface ISpawnPlayerResponse extends ISpawnObjectResponse {
    name: string;
    isTagged: boolean;
}

export class SpawnPlayerResponse extends SpawnObjectResponse {

    public name: string;
    public isTagged: boolean = false;

    constructor(location: Vector3, rotation: Vector3, scale: Vector3, id: string, name: string, isTagged: boolean) {
        super(location, rotation, scale, id);
        this.name = name;
        this.isTagged = isTagged;

        this.setType(ResponseType.SPAWN_PLAYER);
    }

    public override get(): ISpawnPlayerResponse {
        return {
            ...super.get(),
            name: this.name,
            isTagged: this.isTagged,
        };
    }

}