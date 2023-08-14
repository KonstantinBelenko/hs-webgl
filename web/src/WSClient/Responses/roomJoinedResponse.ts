import { IBaseResponse, BaseResponse } from "./baseResponse.js";
import { ResponseType } from "./types/index.d.js";

interface IRoomJoinedResponse extends IBaseResponse {
    roomId: string;
}

export class RoomJoinedResponse extends BaseResponse {

    public roomId: string;

    constructor(roomId: string) {
        super(ResponseType.ROOM_JOINED);
        this.roomId = roomId;
    }

    public override get(): IRoomJoinedResponse {
        return {
            ...super.get(),
            roomId: this.roomId,
        };
    }

}