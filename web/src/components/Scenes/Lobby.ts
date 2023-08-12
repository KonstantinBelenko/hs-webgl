import * as THREE from "three";
import Player from "../Objects/Player.js";
import Stats from "stats.js";
import HDRI from "../Graphics/HDRI.js";
import Model from "../Objects/Model.js";
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

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

        this.loadLevel();
        this.loadPlayer(playerName);
        this.animate();
    }

    private loadLevel() {
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

        // Floor
		const floor = new THREE.Mesh( 
            new THREE.PlaneGeometry( 10, 10 ),
            new THREE.MeshLambertMaterial( {color: 0xbcbcbc } ) 
        );
		floor.rotation.x = -Math.PI / 2
		floor.receiveShadow = true
        floor.position.y = 0.1
        this.scene.add( floor );
        this.collisionObjects.push( floor );

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
    }

    private loadPlayer(name: string) {
        this.ownerPlayer = new Player(name, true, this.collisionObjects, this.scene, this.cssRenderer, this.onOwnerMove);
        this.onOwnerSpawn(this.ownerPlayer);
    }

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