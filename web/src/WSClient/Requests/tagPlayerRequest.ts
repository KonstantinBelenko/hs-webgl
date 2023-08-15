import { BaseRequest, IBaseRequest } from "./baseRequest.js";
import { RequestType } from "./types/index.d.js";

interface ITagPlayerRequest extends IBaseRequest {
    taggedPlayerName: string;
    taggerPlayerName: string;
}

export class TagPlayerRequest extends BaseRequest {
    public taggedPlayerName: string;
    public taggerPlayerName: string;

    constructor(roomId: string, taggedPlayerName: string, taggerPlayerName: string) {
        super(RequestType.TAG_PLAYER, roomId);
        this.taggedPlayerName = taggedPlayerName;
        this.taggerPlayerName = taggerPlayerName;
    }

    public override get(): ITagPlayerRequest {
        return {
            ...super.get(),
            taggedPlayerName: this.taggedPlayerName,
            taggerPlayerName: this.taggerPlayerName
        }
    }
}