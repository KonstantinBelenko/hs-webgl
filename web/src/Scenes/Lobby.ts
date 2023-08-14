import * as THREE from "three";
import { Player } from "../Objects/Player.js";
import Stats from "stats.js";
import { HDRI } from "../Graphics/HDRI.js";
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { Map } from "../Objects/Map.js";
import * as CANNON from 'cannon-es';
import Text2D from "../Objects/Text.js";

export class Lobby {

    // Lobby
    private lobbyId: string = "";
    private otherPlayers: Player[] = [];

    // Level
    private scene = new THREE.Scene();
    private world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) });
    private renderer = new THREE.WebGLRenderer({ antialias: true });
    private cssRenderer = new CSS2DRenderer();
    
    // Players
    public ownerPlayer: Player | null = null;
    private onOwnerSpawnCallback: (player: Player) => void;
    private onOwnerMoveCallback: (player: Player) => void;

    // Other
    private stats: Stats = new Stats();
    private onAnimate: () => void;

    constructor(playerName: string, lobbyId: string, onOwnerSpawnCallback: (player: Player) => void, onPlayerMove: (player: Player) => void, onAnimate: () => void) {
        this.lobbyId = lobbyId;
        this.onOwnerSpawnCallback = onOwnerSpawnCallback;
        this.onOwnerMoveCallback = onPlayerMove;
        this.onAnimate = onAnimate;
        document.body.appendChild( this.stats.dom );

        this.loadLevel().then(() => {
            this.loadPlayer(playerName);
            this.animate();
        }).catch((error) => {
            console.error(error);
        });
    }

    private async loadLevel(): Promise<void> {
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
        // this.scene.add(new THREE.GridHelper(100, 100, "red", "#282928"));

        // HDRI
        new HDRI("/assets/hdri/clear_sky.hdr", this.renderer, this.scene);

        // Map
        let map = new Map(this.scene, false);
        await map.load(this.world);
    
        // Directional light
        const directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
        this.scene.add( directionalLight );

        // Ambient light
        const ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 );
        this.scene.add( ambientLight );

        // 2D Text saying "Lobby" above the model
        let lobbyTitle = new Text2D(
            this.scene,
            this.cssRenderer,
        );

        this.cssRenderer.setSize( window.innerWidth, window.innerHeight );
        this.cssRenderer.domElement.style.position = 'absolute';
        this.cssRenderer.domElement.style.top = '0px';
        document.body.appendChild( this.cssRenderer.domElement );

        lobbyTitle.createLabel(
            `${this.lobbyId} | Welcome to the Lobby! ✨🦄`,
            new THREE.Vector3(0, 2, 0),
        );
    }

    private loadPlayer(name: string) {

        this.ownerPlayer = new Player(name, true, this.world, this.scene, this.cssRenderer, this.onOwnerMoveCallback);
        this.onOwnerSpawnCallback(this.ownerPlayer);

        // Player spawn position
        this.ownerPlayer.setLocation(
            new THREE.Vector3(10, 5, 0)
        )
    }

    // THIS FUNCTION SPAWNS OTHER PLAYERS
    public spawnOtherPlayer(name: string, position: THREE.Vector3, rotation: THREE.Euler) {
        const player = new Player(name, false, this.world, this.scene, this.cssRenderer);
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
        requestAnimationFrame(this.animate.bind(this));
        this.stats.begin();

        this.world.fixedStep();

        this.otherPlayers.forEach(player => {
            player.fixedUpdate();
        });

        this.ownerPlayer!.fixedUpdate();

        if (this.ownerPlayer?.getLocationVector().y! < -15) {
            this.ownerPlayer?.setLocation(new THREE.Vector3(0, 30, 0));
        }

        this.onAnimate();
        
        this.renderer.render( this.scene, this.ownerPlayer?.camera! );
        this.cssRenderer.render( this.scene, this.ownerPlayer?.camera! );
        this.stats.end();
    }
}