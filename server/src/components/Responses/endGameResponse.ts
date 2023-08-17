import { BaseResponse, IBaseResponse } from "./baseResponse";
import { ResponseType } from "./responseTypes";

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
            type: this.type,
            scores: this.scores,
        }
    }

}