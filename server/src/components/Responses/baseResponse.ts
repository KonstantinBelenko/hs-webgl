import { IBaseRequest } from "../Requests/baseRequest";
import { ResponseType } from "./responseTypes";

export interface IBaseResponse {
    type: string;
}

export class BaseResponse {
    type: string;

    constructor(type: ResponseType) {
        this.type = type;
    }

    public get(): IBaseResponse {
        return {
            type: this.type
        };
    }

    public setType(type: ResponseType) {
        this.type = type;
    }
}