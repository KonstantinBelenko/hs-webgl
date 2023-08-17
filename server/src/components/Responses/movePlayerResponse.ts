import { Vector3 } from "../utils";
import { MoveObjectResponse, IMoveObjectResponse } from "./moveObjectResponse";
import { ResponseType } from "./responseTypes";

export interface IMovePlayerResponse extends IMoveObjectResponse {
    name: string;
}

export class MovePlayerResponse extends MoveObjectResponse {
    
        private name: string;
    
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