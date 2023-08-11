export default interface Spawn {
    type: "spawn",
    name: string,
    object_type: string,
    location: {
        x: number,
        y: number,
        z: number,
    },
    rotation: {
        x: number,
        y: number,
        z: number,
    },
    scale: {
        x: number,
        y: number,
        z: number,
    },
}