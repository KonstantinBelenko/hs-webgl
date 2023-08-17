import { BaseResponse } from "./Responses/baseResponse.js";
import { IPlayer, Vector3 } from "./utils.js";

export class Player {

    public name: string = "";
    public location: Vector3 = { x: 0, y: 0, z: 0 };
    public rotation: Vector3 = { x: 0, y: 0, z: 0 };
    public scale: Vector3 = { x: 1, y: 1, z: 1 };
    public isAdmin: boolean = false;
    public ws: any;

    public isTagged = false;
    public score = 0;

    constructor (ws: any, name: string, isAdmin: boolean = false) {
        this.ws = ws;
        this.name = name;
        this.isAdmin = isAdmin;
    }

    public getLocation (): Vector3 {
        return this.location;
    }
    
    public getRotation (): Vector3 {
        return this.rotation;
    }

    public getScale (): Vector3 {
        return this.scale;
    }

    public setLocation (location: Vector3) {
        this.location = location;
    }

    public setRotation (rotation: Vector3) {
        this.rotation = rotation;
    }

    public setScale (scale: Vector3) {
        this.scale = scale;
    }

    public getName (): string {
        return this.name;
    }

    public getJSON (): IPlayer {
        return {
            name: this.name,
            isAdmin: this.isAdmin,
            location: this.location,
            rotation: this.rotation,
            scale: this.scale,
        }
    }

    public send(data: BaseResponse) {
        this.ws.send(JSON.stringify(data.get()));
    }

    public setTagged (tagged: boolean) {
        this.isTagged = tagged;
    }

    public setScore (score: number) {
        this.score = score;
    }

    public getScore (): number {
        return this.score;
    }

    public addScore () {
        this.score += 10;
    }

    public deductScore () {
        this.score -= 10;
    }

}