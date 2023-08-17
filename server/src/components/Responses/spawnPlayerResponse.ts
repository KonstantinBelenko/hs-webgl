import { Vector3 } from "../utils";
import { ResponseType } from "./responseTypes";
import { SpawnObjectResponse, ISpawnObjectResponse } from "./spawnObjectResponse";

interface ISpawnPlayerResponse extends ISpawnObjectResponse {
    name: string;
    isTagged: boolean;
}

export class SpawnPlayerResponse extends SpawnObjectResponse {

    private name: string;
    private isTagged: boolean;

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
            isTagged: this.isTagged
        };
    }
}