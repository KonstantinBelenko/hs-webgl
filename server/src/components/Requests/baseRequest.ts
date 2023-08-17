import { RequestType } from "./requestTypes";

export interface IBaseRequest {
    type: string;
    roomId: string;
}

export class BaseRequest {
    type: string;
    roomId: string;

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