import BaseRequest, { IBaseRequest } from "./baseRequest.js";
import { RequestType } from "./requestTypes.js";

interface IJoinLobbyRequest extends IBaseRequest {
    name: string;
}

export default class JoinLobbyRequest extends BaseRequest {

    private name: string = "";

    constructor(playerName: string, roomId: string) {
        super(RequestType.JOIN_ROOM, roomId);
        this.name = playerName;
    }

    public override get(): IJoinLobbyRequest {
        return {
            ...super.get(),
            name: this.name,
        };
    }
}