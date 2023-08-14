import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { PMREMGenerator } from 'three/src/extras/PMREMGenerator.js';
export class HDRI {

    constructor (file: string, renderer: THREE.WebGLRenderer, private scene: THREE.Scene) {
        const rgbeLoader = new RGBELoader();
        const pmremGenerator = new PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();
    
        rgbeLoader.load(file, (texture) => {
            const envMap = pmremGenerator.fromEquirectangular(texture).texture;
            
            texture.dispose();
            pmremGenerator.dispose();
            
            this.scene.environment = envMap;
            this.scene.background = envMap;
        });
    }

}