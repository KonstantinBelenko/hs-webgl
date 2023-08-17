import { BaseRequest, IBaseRequest } from "./baseRequest";
import { RequestType } from "./requestTypes";

interface IJoinRoomRequest extends IBaseRequest {
    name: string;
    roomId: string;
}

export class JoinRoomRequest extends BaseRequest {
    name: string;
    roomId: string;

    constructor(name: string, roomId: string) {
        super(RequestType.JOIN_ROOM, roomId);
        this.name = name;
        this.roomId = roomId;
    }

    public override get(): IJoinRoomRequest {
        return {
            ...super.get(),
            name: this.name,
            roomId: this.roomId
        }
    }

}