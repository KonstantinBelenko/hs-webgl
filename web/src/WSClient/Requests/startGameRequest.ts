import { BaseRequest, IBaseRequest } from "./baseRequest.js";
import { RequestType } from "./types/index.d.js";

export class StartGameRequest extends BaseRequest {

    constructor(roomId: string) {
        super(RequestType.START_GAME, roomId);
    }

    public override get(): IBaseRequest {
        return {
            ...super.get(),
        };
    }
}