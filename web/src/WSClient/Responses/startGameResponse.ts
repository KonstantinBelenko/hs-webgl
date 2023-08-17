import { BaseResponse, IBaseResponse } from "./baseResponse.js";
import { ResponseType } from "./types/index.js";

export class StartGameResponse extends BaseResponse {

    constructor() {
        super(ResponseType.START_GAME);
    }

    public override get(): IBaseResponse {
        return {
            ...super.get(),
        };
    }

}