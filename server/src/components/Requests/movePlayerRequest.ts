import { Vector3 } from "../utils";
import { MoveObjectRequest, IMoveObjectRequest } from "./moveObjectRequest";
import { RequestType } from "./requestTypes";

export interface IMovePlayerRequest extends IMoveObjectRequest {
    name: string;
}

export class MovePlayerRequest extends MoveObjectRequest {

    public name: string;

    constructor(roomId: string, id: string, name: string, location: Vector3, rotation: Vector3) {
        super(roomId, id, location, rotation);
        this.name = name;

        this.setType(RequestType.MOVE_PLAYER);
    }

    public override get(): IMovePlayerRequest {
        return {
            ...super.get(),
            name: this.name
        }
    }

}