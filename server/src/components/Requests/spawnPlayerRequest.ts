import { Vector3 } from "../utils";
import { RequestType } from "./requestTypes";
import { ISpawnObjectRequest, SpawnObjectRequest } from "./spawnObjectRequest";

interface ISpawnPlayerRequest extends ISpawnObjectRequest {
    name: string;
}

export class SpawnPlayerRequest extends SpawnObjectRequest {

    public name: string;

    constructor(roomId: string, location: Vector3, rotation: Vector3, scale: Vector3, id: string, name: string) {
        super(roomId, location, rotation, scale, id);
        this.name = name;
        this.setType(RequestType.SPAWN_PLAYER);
    }

    public override get(): ISpawnPlayerRequest {
        return {
            ...super.get(),
            name: this.name
        };
    }

}