import BaseRequest, { IBaseRequest } from "./baseRequest.js";
import { RequestType } from "./requestTypes.js";
import { Vector3 } from "./spawnObjcetRequest.js";

export interface IMoveObjectRequest extends IBaseRequest {
    id: string;
    location: Vector3;
    rotation: Vector3;
}

export default class MoveObjectRequest extends BaseRequest {

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