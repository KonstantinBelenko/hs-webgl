import { BaseResponse, IBaseResponse } from "./baseResponse.js";
import { ResponseType } from "./types/index.js";

interface ITagPlayerResponse extends IBaseResponse {
    taggedPlayerName: string;
    taggerPlayerResponse: string;
}

export class TagPlayerResponse extends BaseResponse {

    public taggedPlayerName: string;
    public taggerPlayerName: string;

    constructor(taggedPlayerName: string, taggerPlayerName: string) {
        super(ResponseType.TAG_PLAYER);
        this.taggedPlayerName = taggedPlayerName;
        this.taggerPlayerName = taggerPlayerName;
    }

    public override get(): ITagPlayerResponse {
        return {
            ...super.get(),
            taggedPlayerName: this.taggedPlayerName,
            taggerPlayerResponse: this.taggerPlayerName
        }
    }

}