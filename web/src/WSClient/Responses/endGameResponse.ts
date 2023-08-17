import { BaseResponse, IBaseResponse } from "./baseResponse.js";
import { ResponseType } from "./types/index.js";

interface Score {
    name: string,
    score: number
}

interface IEndGameResponse extends IBaseResponse {
    scores: Score[]
}

export class EndGameResponse extends BaseResponse {

    public scores: Score[];

    constructor(scores: Score[]) {
        super(ResponseType.END_GAME);
        this.scores = scores;
    }

    public override get(): IEndGameResponse {
        return {
            ...super.get(),
            scores: this.scores,
        }
    }
}