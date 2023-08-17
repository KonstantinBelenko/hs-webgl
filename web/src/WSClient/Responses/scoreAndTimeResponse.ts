import { BaseResponse, IBaseResponse } from "./baseResponse.js";
import { ResponseType } from "./types/index.js";

interface IScoreAndTimeResponse extends IBaseResponse {
    time: number;
    score: number;
}

export class ScoreAndTimeResponse extends BaseResponse {
    
    public score: number;
    public time: number;

    constructor(scores: number, time: number) {
        super(ResponseType.SCORE_AND_TIME);
        this.time = time;
        this.score = scores;
    }

    public override get(): IScoreAndTimeResponse {
        return {
            ...super.get(),
            score: this.score,
            time: this.time,
        };
    }
}