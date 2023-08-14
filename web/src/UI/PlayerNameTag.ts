import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import Text2D from '../Objects/Text.js';
export class PlayerNameTag {

    private nameTag: Text2D;

    constructor(name: string, playerPosition: { x: number, y: number, z: number }, scene: THREE.Scene, renderer2D: CSS2DRenderer) {
        this.nameTag = new Text2D(scene, renderer2D);
        this.nameTag.createLabel(name, {
            x: playerPosition.x,
            y: playerPosition.y + 2,
            z: playerPosition.z,
        });
    }

    public updatePosition(playerPosition: {
        x: number,
        y: number,
        z: number,
    }) {
        this.nameTag.updateLabelContent(
            this.nameTag.getText(),
            playerPosition,
        );
    }

    public updateName(name: string) {
        this.nameTag.updateLabelContent(
            name,
        );
    }

    public destroy() {
        this.nameTag.destroy();
    }

}