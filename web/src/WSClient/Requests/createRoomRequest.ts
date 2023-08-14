import { IBaseRequest, BaseRequest } from "./baseRequest.js";
import { RequestType } from "./types/index.d.js";

interface ICreateRoomRequest extends IBaseRequest {
    name: string;
}

export class CreateRoomRequest extends BaseRequest {

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