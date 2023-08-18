import { BaseResponse, IBaseResponse } from "./baseResponse.js";
import { ResponseType } from "./types/index.js";

interface Score {
    name: string;
    score: number;
}

interface IScoreAndTimeResponse extends IBaseResponse {
    time: number;
    scores: Score[];
}

export class ScoreAndTimeResponse extends BaseResponse {
    
    public scores: Score[];
    public time: number;

    constructor(scores: Score[], time: number) {
        super(ResponseType.SCORE_AND_TIME);
        this.time = time;
        this.scores = scores;
    }

    public override get(): IScoreAndTimeResponse {
        return {
            ...super.get(),
            scores: this.scores,
            time: this.time,
        };
    }
}