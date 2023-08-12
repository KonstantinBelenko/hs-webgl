import { RequestType } from './requestTypes.js';
import SpawnObjectRequest, { ISpawnObjectRequest, Vector3 } from './spawnObjcetRequest.js';

interface ISpawnPlayerRequest extends ISpawnObjectRequest {
    name: string;
}

export default class SpawnPlayerRequest extends SpawnObjectRequest {

    private name: string;

    constructor(roomId: string, location: Vector3, rotation: Vector3, scale: Vector3, id: string, name: string) {
        super(roomId, location, rotation, scale, id);
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