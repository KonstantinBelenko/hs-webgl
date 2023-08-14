import { IBaseResponse, BaseResponse } from "./baseResponse.js";
import { ResponseType } from "./types/index.d.js";

interface IRoomCreatedResponse extends IBaseResponse {
    roomId: string
}

export class RoomCreatedResponse extends BaseResponse {
    
    public roomId: string = "";

    constructor() {
        super(ResponseType.ROOM_CREATED);
    }

    public override get(): IRoomCreatedResponse {
        return {
            type: this.type,
            roomId: this.roomId
        }
    }
}