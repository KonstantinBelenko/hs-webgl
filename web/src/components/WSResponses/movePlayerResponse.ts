import { Vector3 } from "../WSRequests/spawnObjcetRequest.js";
import MoveObjectResponse, { IMoveObjectResponse } from "./moveObjectResponse.js";
import { ResponseType } from "./responseTypes.js";

export interface IMovePlayerResponse extends IMoveObjectResponse{
    name: string;
}

export default class MovePlayerResponse extends MoveObjectResponse {

    public name: string;

    constructor(id: string, name: string, location: Vector3, rotation: Vector3) {
        super(id, location, rotation);
        this.name = name;

        this.setType(ResponseType.MOVE_PLAYER);
    }

    public override get(): IMovePlayerResponse {
        return {
            ...super.get(),
            name: this.name
        }
    }
}