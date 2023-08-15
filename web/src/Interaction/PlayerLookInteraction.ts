import * as THREE from "three";
import { Player } from "../Objects/Player.js";
import { PlayerCrosshair } from "../UI/PlayerCrosshair.js";
import { ActionIndicator } from "../UI/ActionIndicator.js";

export class PlayerLookInteraction {
    private raycaster: THREE.Raycaster;
    private camera: THREE.PerspectiveCamera;
    private players: Player[];
    private crosshair: PlayerCrosshair;

    constructor(camera: THREE.PerspectiveCamera, crosshair: PlayerCrosshair, players: Player[]) {
        this.camera = camera;
        this.crosshair = crosshair;
        this.players = players;
        this.raycaster = new THREE.Raycaster();
    }

    public checkPlayerLook(): Player | null {
        // Update the ray with the camera and direction
        this.raycaster.setFromCamera(new THREE.Vector2(), this.camera);
        
        // In PlayerLookInteraction.checkPlayerLook method
        if (!this.raycaster || !this.raycaster.ray) {
            console.error('Raycaster or its ray is invalid', this.raycaster);
            return null;
        }

        const validPlayerMeshes = this.players
            .map(p => p.getMesh())
            .filter(mesh => mesh !== null) as THREE.Mesh[];

        const intersects = this.raycaster.intersectObjects(validPlayerMeshes);
        
        if (intersects.length > 0) {
            // Check the first intersection (the closest object)
            const closest = intersects[0];
            if (closest.distance < 5) {
                // If the player is within 5m, change the crosshair color
                this.crosshair.setColor('red'); // assuming you have a setColor method
                ActionIndicator.setActive(true);
                ActionIndicator.setText('TOUCH');
                
                return this.players.find(p => p.getMesh() === closest.object) as Player;
            } else {
                // Reset the crosshair color
                this.crosshair.setColor('white');
                ActionIndicator.setActive(false);
                return null;
            }
        } else {
            // If no intersections, reset the crosshair color
            this.crosshair.setColor('white');
            ActionIndicator.setActive(false);
            return null;
        }
    }

    public setDefaultActionUI () {
        this.crosshair.setColor('white');
        ActionIndicator.setActive(false);
    }
}