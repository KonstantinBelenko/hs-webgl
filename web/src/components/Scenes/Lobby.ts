import * as THREE from "three";
import Player from "../Objects/Player.js";
import Stats from "stats.js";
import HDRI from "../Graphics/HDRI.js";
import Model from "../Objects/Model.js";
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export default class Lobby {

    // Lobby
    private lobbyId: string = "";

    // Level
    private clock = new THREE.Clock();
    private scene = new THREE.Scene();
    private renderer = new THREE.WebGLRenderer({ antialias: true });
    private collisionObjects: THREE.Object3D[] = [];
    private cssRenderer = new CSS2DRenderer();
    
    // Players
    public ownerPlayer: Player | null = null;
    private otherPlayers: Player[] = [];
    private onOwnerSpawn: (player: Player) => void;
    private onOwnerMove: (player: Player) => void;

    // Other
    private stats: Stats = new Stats();
    private onAnimate: () => void;

    constructor(playerName: string, lobbyId: string, onOwnerSpawn: (player: Player) => void, onPlayerMove: (player: Player) => void, onAnimate: () => void) {
        this.lobbyId = lobbyId;
        this.onOwnerSpawn = onOwnerSpawn;
        this.onOwnerMove = onPlayerMove;
        this.onAnimate = onAnimate;
        document.body.appendChild( this.stats.dom );

        this.loadLevel().then(() => {
            this.loadPlayer(playerName);
            this.animate();
        }).catch((error) => {
            console.error(error);
        });
    }

    private subdivideModelForCollision(mesh: THREE.Object3D, gridSize: number): THREE.Mesh[] {
        const boxes: THREE.Mesh[] = [];
        const boundingBox = new THREE.Box3().setFromObject(mesh);
        const size = boundingBox.getSize(new THREE.Vector3());
    
        for (let x = boundingBox.min.x; x <= boundingBox.max.x; x += gridSize) {
            for (let y = boundingBox.min.y; y <= boundingBox.max.y; y += gridSize) {
                for (let z = boundingBox.min.z; z <= boundingBox.max.z; z += gridSize) {
                    const boxCenter = new THREE.Vector3(x + gridSize / 2, y + gridSize / 2, z + gridSize / 2);
                    const box = new THREE.Box3(new THREE.Vector3(x, y, z), new THREE.Vector3(x + gridSize, y + gridSize, z + gridSize));
                    if (box.intersectsBox(boundingBox)) {
                        const cube = new THREE.Mesh(new THREE.BoxGeometry(gridSize, gridSize, gridSize));
                        cube.position.copy(boxCenter);
                        boxes.push(cube);
                    }
                }
            }
        }
        return boxes;
    }

    private loadLevel(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.renderer.setSize( window.innerWidth, window.innerHeight );
            this.renderer.setPixelRatio( window.devicePixelRatio );
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            this.renderer.toneMappingExposure = 1;
            this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
            // this.renderer.gammaOutput = true;
            // this.renderer.gammaFactor = 2.2;
            document.body.appendChild( this.renderer.domElement );
    
            // Grid helper
            this.scene.add(new THREE.GridHelper(100, 100, "red", "#282928"));
    
            // HDRI
            new HDRI("/assets/hdri/clear_sky.hdr", this.renderer, this.scene);
    
            // Map
            const loader = new GLTFLoader();
            loader.load("/assets/models/map.glb", (gltf) => {
                let mapMesh = gltf.scene;
            
                gltf.scene.traverse(function (object) {
                    if (object.isObject3D) {
                        object.castShadow = true;
                        object.receiveShadow = true;
                    }
                });
        
                // Update the bounding box of the mesh after scaling
                mapMesh.traverse(function(object) {
                    if (object instanceof THREE.Mesh) {
                        object.geometry.computeBoundingBox();
                        // if needed also compute the bounding sphere
                        // object.geometry.computeBoundingSphere();
                    }
                });

                this.collisionObjects.push(mapMesh);
                this.scene.add(mapMesh);

                // Directional light
                const directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
                this.scene.add( directionalLight );

                // Ambient light
                const ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 );
                this.scene.add( ambientLight );

                // Model
                new Model("/assets/models/neeko.glb", this.scene)

                // 2D Text saying "Lobby" above the model
                this.cssRenderer.setSize( window.innerWidth, window.innerHeight );
                this.cssRenderer.domElement.style.position = 'absolute';
                this.cssRenderer.domElement.style.top = '0px';
                document.body.appendChild( this.cssRenderer.domElement );

                const labelDiv = document.createElement('div');
                labelDiv.className = 'label';
                labelDiv.textContent = `${this.lobbyId} | Welcome to the Lobby! ✨🦄`;
                labelDiv.style.marginTop = '-1em';
                const label = new CSS2DObject(labelDiv);
                label.position.set(0, 2, 0);  // Set the position to where you want it, here it's 5 units above the origin
                this.scene.add(label);

                // Resolve the promise here, after adding the mapMesh to collisionObjects
                resolve();

            }, undefined, error => {
                console.error(error);
                reject(error);  // Reject the promise if there's an error
            });
        });
    }

    private loadPlayer(name: string) {

        console.log(this.collisionObjects.length);
        this.collisionObjects.forEach(obj => {
            obj.traverse(child => {
                if (child instanceof THREE.Mesh) {
                    const boxHelper = new THREE.BoxHelper(child, 0xffff00); // Yellow color for the bounding box
                    this.scene?.add(boxHelper);
                }
            });
        });

        this.ownerPlayer = new Player(name, true, this.collisionObjects, this.scene, this.cssRenderer, this.onOwnerMove);
        this.onOwnerSpawn(this.ownerPlayer);

        // 3 times higher than the model
        this.ownerPlayer.setLocation(
            new THREE.Vector3(0, 40, 0)
        )
    }

    // THIS FUNCTION SPAWNS OTHER PLAYERS
    public spawnOtherPlayer(name: string, position: THREE.Vector3, rotation: THREE.Euler) {
        const player = new Player(name, false, this.collisionObjects, this.scene, this.cssRenderer);
        player.setLocation(position);
        player.setRotation(rotation);
        this.otherPlayers.push(player);
    }

    public moveOtherPlayer(name: string, location: THREE.Vector3, rotation: THREE.Euler) {
        const player = this.otherPlayers.find(p => p.getName() === name);
        if (!player) throw new Error("Player not found");
        player.setLocation(location);
        player.setRotation(rotation);
    }

    private animate() {
        this.stats.begin();

        let delta = this.clock.getDelta();
        this.renderer.render( this.scene, this.ownerPlayer?.camera! );

        this.ownerPlayer?.fixedUpdate(delta);

        this.onAnimate();
        
        // render text
        this.cssRenderer.render( this.scene, this.ownerPlayer?.camera! );

        this.stats.end();
        requestAnimationFrame(this.animate.bind(this));
    }
}