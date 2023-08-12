import { Vector3 } from "../utils";
import BaseResponse, { IBaseResponse } from "./baseResponse";
import { ResponseType } from "./responseTypes";

export interface ISpawnObjectResponse extends IBaseResponse {
    location: Vector3;
    rotation: Vector3;
    scale: Vector3;
    id: string;
}

export default class SpawnObjectResponse extends BaseResponse {

    private location: Vector3;
    private rotation: Vector3;
    private scale: Vector3;
    private id: string;

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