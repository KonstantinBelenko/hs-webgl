import { IMoveObjectRequest, MoveObjectRequest } from "./moveObjectRequest.js";
import { RequestType } from "./types/index.d.js";
import { Vector3 } from "../types/index.d.js";

export interface IMovePlayerRequest extends IMoveObjectRequest {
    name: string;
}

export class MovePlayerRequest extends MoveObjectRequest {

    private name: string;

    constructor(roomId: string, name: string, location: Vector3, rotation: Vector3) {
        super(roomId, "player", location, rotation);
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