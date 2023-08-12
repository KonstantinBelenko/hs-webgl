import BaseResponse, { IBaseResponse } from "./baseResponse";
import { ResponseType } from "./responseTypes";

export interface IRoomJoinedResponse extends IBaseResponse {
    roomId: string;
}

export default class RoomJoinedResponse extends BaseResponse {

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