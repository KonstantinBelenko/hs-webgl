import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export default class Model {

    public mesh: THREE.Group | null = null;

    constructor(file: string, private scene: THREE.Scene) {
        const loader = new GLTFLoader();
		loader.load(file, (gltf) => {
			this.mesh = gltf.scene;
		
			gltf.scene.traverse(function (object) {
				if (object.isObject3D) object.castShadow = true;
			});
		
			scene.add( this.mesh );
		}, undefined, console.error);
    }
}