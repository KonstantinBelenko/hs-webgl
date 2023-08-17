import * as THREE from "three";
export class CameraBop {
    private amplitude: number;
    private frequency: number;
    private offset: THREE.Vector3;
    private phase: number;
    
    constructor(amplitude: number = 0.05, frequency: number = 2) {
        this.amplitude = amplitude;   // Maximum movement amount
        this.frequency = frequency;   // Speed of the bop motion
        this.offset = new THREE.Vector3(0, 0, 0); // Current offset of the camera
        this.phase = 0;               // Current phase of the bop motion
    }

    /**
     * Updates the camera bop animation. Should be called every frame.
     * @param delta - The elapsed time since the last frame.
     * @param speed - The current speed of the player.
     * @returns The offset for the camera.
     */
    public update(delta: number, speed: number): THREE.Vector3 {
        if (speed > 0) {
            this.phase += delta * this.frequency;
            this.offset.y = Math.sin(this.phase) * this.amplitude * speed;
        } else {
            // Return camera to the original position when the player stops
            this.offset.y *= 0.9;
            if (Math.abs(this.offset.y) < 0.001) this.offset.y = 0;
        }
        return this.offset;
    }
}

