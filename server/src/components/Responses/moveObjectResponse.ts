import { Vector3 } from "../utils";
import BaseResponse, { IBaseResponse } from "./baseResponse";
import { ResponseType } from "./responseTypes";

export interface IMoveObjectResponse extends IBaseResponse {
    id: string;
    location: Vector3;
    rotation: Vector3;
}

export default class MoveObjectResponse extends BaseResponse {

    private id: string;
    private location: Vector3;
    private rotation: Vector3;

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