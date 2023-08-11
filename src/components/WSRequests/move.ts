export default interface Move {
    type: "move",
    name: string,
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