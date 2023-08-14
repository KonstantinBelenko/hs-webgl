import * as THREE from 'three'; // Assuming Three.js is available
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

export default class Text2D {
    private cssRenderer: CSS2DRenderer;
    private scene: THREE.Scene;
    private textObject: CSS2DObject | null = null;

    constructor(scene: THREE.Scene, renderer: CSS2DRenderer) {
        this.cssRenderer = renderer;
        this.scene = scene;
        this.initRenderer();
    }

    private initRenderer(): void {
        this.cssRenderer.setSize(window.innerWidth, window.innerHeight);
        this.cssRenderer.domElement.style.position = 'absolute';
        this.cssRenderer.domElement.style.top = '0px';
        document.body.appendChild(this.cssRenderer.domElement);
    }

    public createLabel(content: string, position: {
        x: number,
        y: number,
        z: number,
    }): void {
        const labelDiv = document.createElement('div');
        labelDiv.className = 'label';
        labelDiv.textContent = content;
        labelDiv.style.marginTop = '-1em';

        this.textObject = new CSS2DObject(labelDiv);
        this.textObject.position.copy(
            new THREE.Vector3(
                position.x,
                position.y,
                position.z,
            )
        );

        this.scene.add(this.textObject);
    }

    public updateLabelContent(content: string, location?: {
        x: number,
        y: number,
        z: number,
    }): void {
        if (this.textObject && this.textObject.element instanceof HTMLDivElement) {
            this.textObject.element.textContent = content;
            if (location) {
                this.textObject.position.copy(
                    new THREE.Vector3(
                        location.x,
                        location.y,
                        location.z,
                    )
                );
            }
        }
    }

    public getText(): string {
        return this.textObject?.element.textContent || "";
    }

    public destroy(): void {
        if (this.textObject) {
            this.scene.remove(this.textObject);
            this.textObject = null;
        }
    }
}
