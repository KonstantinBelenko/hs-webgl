import { BaseResponse, IBaseResponse } from "./baseResponse";
import { ResponseType } from "./responseTypes";

interface ITagPlayerResponse extends IBaseResponse {
    taggedPlayerName: string;
    taggerPlayerName: string;
}

export class TagPlayerResponse extends BaseResponse {

    public taggedPlayerName: string;
    public taggerPlayerName: string;

    constructor(tagged: string, tagger: string) {
        super(ResponseType.TAG_PLAYER);
        this.taggedPlayerName = tagged;
        this.taggerPlayerName = tagger;
    }

    public override get(): ITagPlayerResponse {
        return {
            ...super.get(),
            taggedPlayerName: this.taggedPlayerName,
            taggerPlayerName: this.taggerPlayerName
        }
    }

}