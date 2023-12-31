import { RequestType } from "./types/index.d.js";

export interface IBaseRequest {
    type: RequestType;
    roomId: string;
}

export class BaseRequest {

    private type: RequestType;
    private roomId: string;

    constructor(type: RequestType, roomId: string) {
        this.type = type;
        this.roomId = roomId;
    }

    public get(): IBaseRequest {
        return {
            type: this.type,
            roomId: this.roomId,
        };
    }

    public setType(type: RequestType) {
        this.type = type;
    }

}