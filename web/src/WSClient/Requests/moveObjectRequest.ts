import { Vector3 } from "../types/index.d.js";
import { IBaseRequest, BaseRequest } from "./baseRequest.js";
import { RequestType } from "./types/index.d.js";

export interface IMoveObjectRequest extends IBaseRequest {
    id: string;
    location: Vector3;
    rotation: Vector3;
}

export class MoveObjectRequest extends BaseRequest {

    private id: string;
    private location: Vector3;
    private rotation: Vector3;

    constructor(roomId: string, id: string, location: Vector3, rotation: Vector3) {
        super(RequestType.MOVE_OBJECT, roomId);
        this.id = id;
        this.location = location;
        this.rotation = rotation;
    }

    public override get(): IMoveObjectRequest {
        return {
            ...super.get(),
            id: this.id,
            location: this.location,
            rotation: this.rotation
        }
    }

}