import BaseRequest, { IBaseRequest } from "./baseRequest.js";
import { RequestType } from "./requestTypes.js";

interface ICreateRoomRequest extends IBaseRequest {
    name: string;
}

export default class CreateRoomRequest extends BaseRequest {

    private name: string = "";

    constructor(ownerName: string) {
        super(RequestType.CREATE_ROOM, "empty");
        this.name = ownerName;
    }

    public override get(): ICreateRoomRequest {
        return {
            ...super.get(),
            name: this.name
        };
    }
}