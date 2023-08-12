import BaseRequest, { IBaseRequest } from "./baseRequest";
import { RequestType } from "./requestTypes";

export interface Vector3 {
    x: number;
    y: number;
    z: number;
}

export interface ISpawnObjectRequest extends IBaseRequest {
    location: Vector3;
    rotation: Vector3;
    scale: Vector3;
    id: string;
}

export class SpawnObjectRequest extends BaseRequest {

    public location: Vector3;
    public rotation: Vector3;
    public scale: Vector3;
    public id: string;

    constructor(roomId: string, location: Vector3, rotation: Vector3, scale: Vector3, id: string) {
        super(RequestType.SPAWN_OBJECT, roomId);
        this.location = location;
        this.rotation = rotation;
        this.scale = scale;
        this.id = id;
    }

    public override get(): ISpawnObjectRequest {
        return {
            ...super.get(),
            location: this.location,
            rotation: this.rotation,
            scale: this.scale,
            id: this.id
        };
    }

} 