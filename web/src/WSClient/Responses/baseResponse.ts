import { ResponseType } from "./types/index.d.js";

export interface IBaseResponse {
    type: ResponseType;
}

export class BaseResponse {

    public type: ResponseType;

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