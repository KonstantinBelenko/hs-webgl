import BaseResponse, { IBaseResponse } from "./baseResponse";
import { ResponseType } from "./responseTypes";

interface IRoomCreatedResponse extends IBaseResponse {
    type: string,
    roomId: string
}

export default class RoomCreatedResponse extends BaseResponse {

    roomId: string;

    constructor(roomId: string) {
        super(ResponseType.ROOM_CREATED);
        this.roomId = roomId;
    }

    override get(): IRoomCreatedResponse {
        return {
            type: this.type,
            roomId: this.roomId
        }
    }

}