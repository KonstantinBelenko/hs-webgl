import { BaseRequest, IBaseRequest } from "./baseRequest";
import { RequestType } from "./requestTypes";

interface ITagPlayerRequest extends IBaseRequest {
    taggedPlayerName: string;
    taggerPlayerName: string;
}

export class TagPlayerRequest extends BaseRequest {

    public taggedPlayerName: string;
    public taggerPlayerName: string;

    constructor(roomId: string, tagged: string, tagger: string) {
        super(RequestType.TAG_PLAYER, roomId);
        this.taggedPlayerName = tagged;
        this.taggerPlayerName = tagger;
    }

    public override get(): ITagPlayerRequest {
        return {
            ...super.get(),
            taggedPlayerName: this.taggedPlayerName,
            taggerPlayerName: this.taggerPlayerName
        }
    }
}