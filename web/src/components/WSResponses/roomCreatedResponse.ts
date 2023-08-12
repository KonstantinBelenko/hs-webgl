import BaseResponse, { IBaseResponse } from "./baseResponse.js";
import { ResponseType } from "./responseTypes.js";

interface IRoomCreatedResponse extends IBaseResponse {
    roomId: string
}

export default class RoomCreatedResponse extends BaseResponse {
    
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