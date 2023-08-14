import { IBaseRequest, BaseRequest} from "./baseRequest.js";
import { RequestType } from "./types/index.d.js";

interface IJoinRoomRequest extends IBaseRequest {
    name: string;
}

export class JoinRoomRequest extends BaseRequest {

    private name: string = "";

    constructor(playerName: string, roomId: string) {
        super(RequestType.JOIN_ROOM, roomId);
        this.name = playerName;
    }

    public override get(): IJoinRoomRequest {
        return {
            ...super.get(),
            name: this.name,
        };
    }
}