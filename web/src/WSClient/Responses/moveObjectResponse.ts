import { IBaseResponse, BaseResponse } from "./baseResponse.js";
import { ResponseType } from "./types/index.d.js";
import { Vector3 } from "../types/index.d.js";

export interface IMoveObjectResponse extends IBaseResponse {
    id: string;
    location: Vector3;
    rotation: Vector3;
}

export class MoveObjectResponse extends BaseResponse {

    public id: string;
    public location: Vector3;
    public rotation: Vector3;

    constructor(id: string, location: Vector3, rotation: Vector3) {
        super(ResponseType.MOVE_OBJECT);
        this.id = id;
        this.location = location;
        this.rotation = rotation;
    }

    public override get(): IMoveObjectResponse {
        return {
            ...super.get(),
            id: this.id,
            location: this.location,
            rotation: this.rotation
        }
    }

}