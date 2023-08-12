import MoveObjectRequest, { IMoveObjectRequest } from "./moveObjectRequest.js";
import { RequestType } from "./requestTypes.js";
import { Vector3 } from "./spawnObjcetRequest.js";

export interface IMovePlayerRequest extends IMoveObjectRequest {
    name: string;
}

export default class MovePlayerRequest extends MoveObjectRequest {

    private name: string;

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