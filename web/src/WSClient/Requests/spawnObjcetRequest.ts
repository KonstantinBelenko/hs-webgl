import { IBaseRequest, BaseRequest } from "./baseRequest.js";
import { RequestType } from "./types/index.d.js";
import { Vector3 } from "../types/index.d.js";

export interface ISpawnObjectRequest extends IBaseRequest {
    location: Vector3;
    rotation: Vector3;
    scale: Vector3;
    id: string;
}

export class SpawnObjectRequest extends BaseRequest {
    
    private location: Vector3;
    private rotation: Vector3;
    private scale: Vector3;
    private id: string;

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