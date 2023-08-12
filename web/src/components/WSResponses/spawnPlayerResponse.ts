import { Vector3 } from "../WSRequests/spawnObjcetRequest.js";
import { ResponseType } from "./responseTypes.js";
import SpawnObjectResponse, { ISpawnObjectResponse } from "./spawnObjectResponse.js";

interface ISpawnPlayerResponse extends ISpawnObjectResponse {
    name: string;
}

export default class SpawnPlayerResponse extends SpawnObjectResponse {

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