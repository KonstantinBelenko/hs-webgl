import * as THREE from "three";
import Player from "../Objects/Player.js";
import Stats from "stats.js";
import HDRI from "../Graphics/HDRI.js";
import Model from "../Objects/Model.js";

export default class Lobby {

    // Level
    private clock = new THREE.Clock();
    private scene = new THREE.Scene();
    private renderer = new THREE.WebGLRenderer({ antialias: true });
    private collisionObjects: THREE.Object3D[] = [];

    // Players
    private ownerPlayer: Player | null = null;

    // Other
    private stats: Stats = new Stats();
    private onAnimate: () => void;

    constructor(playerName: string, onAnimate: () => void) {
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
    }

    private loadPlayer(name: string) {
        this.ownerPlayer = new Player(name, true, this.collisionObjects, this.scene);
    }


    private animate() {
        this.stats.begin();

        let delta = this.clock.getDelta();
        this.renderer.render( this.scene, this.ownerPlayer?.camera! );

        this.ownerPlayer?.fixedUpdate(delta);

        this.onAnimate();

        this.stats.end();
        requestAnimationFrame(this.animate.bind(this));
    }
}