import BaseRequest, { IBaseRequest } from "./baseRequest";
import { RequestType } from "./requestTypes";

interface ICreateRoomRequest extends IBaseRequest {
    name: string;
}

export default class CreateRoomRequest extends BaseRequest {
    name: string;

    constructor(name: string) {
        super(RequestType.CREATE_ROOM, "empty");
        this.name = name;
    }

    public override get(): ICreateRoomRequest {
        return {
            ...super.get(),
            name: this.name
        };
    }
}