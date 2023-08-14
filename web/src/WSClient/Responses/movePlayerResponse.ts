import { IMoveObjectResponse, MoveObjectResponse } from "./moveObjectResponse.js";
import { ResponseType } from "./types/index.d.js";
import { Vector3 } from "../types/index.d.js";

export interface IMovePlayerResponse extends IMoveObjectResponse{
    name: string;
}

export class MovePlayerResponse extends MoveObjectResponse {

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