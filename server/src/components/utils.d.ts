export interface Vector3 {
    x: number;
    y: number;
    z: number;
}

export interface IPlayer {
    name: string;
    isAdmin: boolean;
    location: Vector3;
    rotation: Vector3;
    scale: Vector3;
}