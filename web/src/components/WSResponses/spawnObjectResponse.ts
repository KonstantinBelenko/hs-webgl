import { Vector3 } from '../WSRequests/spawnObjcetRequest.js';
import BaseResponse, { IBaseResponse } from './baseResponse.js';
import { ResponseType } from './responseTypes.js';
export interface ISpawnObjectResponse extends IBaseResponse {
    location: Vector3;
    rotation: Vector3;
    scale: Vector3;
    id: string;
}

export default class SpawnObjectResponse extends BaseResponse {

    public location: Vector3;
    public rotation: Vector3;
    public scale: Vector3;
    public id: string;

    constructor(location: Vector3, rotation: Vector3, scale: Vector3, id: string) {
        super(ResponseType.SPAWN_OBJECT);
        this.location = location;
        this.rotation = rotation;
        this.scale = scale;
        this.id = id;
    }

    public override get(): ISpawnObjectResponse {
        return {
            ...super.get(),
            location: this.location,
            rotation: this.rotation,
            scale: this.scale,
            id: this.id
        };
    }

}