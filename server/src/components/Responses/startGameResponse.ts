import { BaseResponse, IBaseResponse } from "./baseResponse";
import { ResponseType } from "./responseTypes";

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