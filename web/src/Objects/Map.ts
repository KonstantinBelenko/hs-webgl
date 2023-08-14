import * as THREE from 'three';
import * as CANNON from 'cannon-es'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Map {

    private loader: GLTFLoader;
    private filePath = "/assets/models/map.glb";
    private SCALE_FACTOR = 0.01725;

    private scene: THREE.Scene;

    private visualize: boolean;

    constructor(scene: THREE.Scene, visualize: boolean = false) {
        this.loader = new GLTFLoader();
        this.scene = scene;
        this.visualize = visualize;
    }

    async load(world: CANNON.World): Promise<void> {

        let gltf = await this.loader.loadAsync(this.filePath);

        this.scene.add(gltf.scene);      
        gltf.scene.traverse((child) => {

            if ((child as THREE.Mesh).isMesh) {
                const mesh = child;

                //@ts-ignore
                if (mesh.geometry.isBufferGeometry) {
                    //@ts-ignore
                    const vertices = mesh.geometry.attributes.position.array;
                    //@ts-ignore
                    const indices = mesh.geometry.index ? mesh.geometry.index.array : Array.from({ length: vertices.length / 3 }, (_, i) => i);
                
                    let scale = new THREE.Vector3();
                    mesh.matrixWorld.decompose(new THREE.Vector3(), new THREE.Quaternion(), scale);

                    const scaledVertices = Array.from(vertices).map((v, index) => {
                        if (index % 3 === 0) return v as number * scale.x * this.SCALE_FACTOR;
                        if (index % 3 === 1) return v as number * scale.y * this.SCALE_FACTOR;
                        if (index % 3 === 2) return v as number * scale.z * this.SCALE_FACTOR;
                        return v;
                    });

                    const trimeshShape = new CANNON.Trimesh(scaledVertices as number[], indices);
                    
                    const staticBody = new CANNON.Body({
                        mass: 0, // making it static
                    });
                
                    staticBody.addShape(trimeshShape);
                    //@ts-ignore
                    staticBody.position.copy(mesh.position);
                
                    const rotationQuaternion = new CANNON.Quaternion();
                    rotationQuaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
                    staticBody.quaternion = rotationQuaternion.mult(staticBody.quaternion);
                    world.addBody(staticBody);

                    if (this.visualize) Map.visualizeTrimesh(trimeshShape, mesh.position, staticBody.quaternion, this.scene);
                }
            }
        });
    }

    static visualizeTrimesh(trimesh: CANNON.Trimesh, position: THREE.Vector3, quaternion: CANNON.Quaternion, scene: THREE.Scene) {
        const geometry = new THREE.BufferGeometry();

        // Set positions and indices directly from the trimesh
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(trimesh.vertices, 3));
        geometry.setIndex(new THREE.Uint32BufferAttribute(trimesh.indices, 1));

        // Use a basic material for visualization
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

        const mesh = new THREE.Mesh(geometry, material);

        if (position) mesh.position.copy(position);
        //@ts-ignore
        if (quaternion) mesh.quaternion.copy(quaternion);

        scene.add(mesh);

        return mesh;
    }

}