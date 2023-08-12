import { ResponseType } from "./responseTypes.js";

export interface IBaseResponse {
    type: ResponseType;
}

export default class BaseResponse {

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