import BaseRequest, { IBaseRequest } from "./baseRequest";
import { RequestType } from "./requestTypes";

interface IJoinLobbyRequest extends IBaseRequest {
    name: string;
    roomId: string;
}

export default class JoinLobbyRequest extends BaseRequest {
    name: string;
    roomId: string;

    constructor(name: string, roomId: string) {
        super(RequestType.JOIN_ROOM, roomId);
        this.name = name;
        this.roomId = roomId;
    }

    public override get(): IJoinLobbyRequest {
        return {
            ...super.get(),
            name: this.name,
            roomId: this.roomId
        }
    }

}