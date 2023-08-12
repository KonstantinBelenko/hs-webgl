import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { Vector3 } from "../WSRequests/spawnObjcetRequest.js";
import Text2D from "./Text.js";
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';

export default class Player {

    private static HEIGHT = 1.8;

    private isOwner: boolean = false;
    private name: string = "";
    private scene: THREE.Scene | null = null;
    private renderer2D: CSS2DRenderer | null = null;

    // camera
    public camera: THREE.PerspectiveCamera | null = null;
    
    // UI
    private static DEFAULT_CROSSHAIR_COLOR = 'white';
    private crosshair: HTMLElement | null = null;
    private color: string = "";

    private nameTag: Text2D | null = null;

    // Physics
    public collisionObjects: THREE.Object3D[] = [];
    
    private static GRAVITY = 9.81;
    private static JUMP_FORCE = 4;
    
    private velocity: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    private acceleration: number = 0.05; // Adjust as needed
    private maxSpeed: number = 15; // Adjust as needed
    private deceleration: number = 0.9; // Adjust as needed

    private isGrounded: boolean = false;
    private isJumping: boolean = false;

    // Movement
    private controls: PointerLockControls | null = null;
    private keysPressed: Set<string> = new Set();
    private onOwnerMove: ((player: Player) => void) | null = null;

    // Mesh
    public playerMesh: THREE.Mesh | null = null // The public mesh representing the player


    constructor(
        name: string, 
        isOwner: boolean, 
        collisionObjects: THREE.Object3D[],
        scene: THREE.Scene,
        renderer: CSS2DRenderer,
        onOwnerMove?: (player: Player) => void
    ) {
        this.name = name;
        this.isOwner = true;
        this.collisionObjects = collisionObjects;
        this.scene = scene;
        this.renderer2D = renderer;
        if (onOwnerMove) this.onOwnerMove = onOwnerMove;

        // create player mesh
        this.loadPlayerMesh(scene); // must appear before loadCamera()
        this.load2DNameTag(); // must appear after loadPlayerMesh()
        
        if (isOwner) {
            this.loadCamera();
            this.loadCrosshair();
            this.loadControls();
        }

    }

    private loadPlayerMesh(scene: THREE.Scene) {
        let colors = ["red", "blue", "green", "yellow", "orange", "purple"];
        this.color = colors[Math.floor(Math.random() * colors.length)];

        const geometry = new THREE.BoxGeometry(.5, Player.HEIGHT, .5); // A simple box geometry
        const material = new THREE.MeshBasicMaterial({ color: this.color }); // Green color for demonstration
        this.playerMesh = new THREE.Mesh(geometry, material);
        scene.add(this.playerMesh);
    }

    private load2DNameTag() {
        this.nameTag = new Text2D(this.scene!, this.renderer2D!);
        this.nameTag.createLabel(
            this.name, 
            this.getLocation().clone().add(new THREE.Vector3(0, 2, 0))
        );
    }

    private loadCamera() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.y = Player.HEIGHT;
    }

    private loadCrosshair() {
        this.crosshair = document.createElement('div');
        this.crosshair.style.width = '5px';
        this.crosshair.style.height = '5px';
        this.crosshair.style.background = Player.DEFAULT_CROSSHAIR_COLOR;
        this.crosshair.style.borderRadius = '50%';
        this.crosshair.style.position = 'absolute';
        this.crosshair.style.left = '50%';
        this.crosshair.style.top = '50%';
        this.crosshair.style.transform = 'translate(-50%, -50%)';
        document.body.appendChild(this.crosshair);
    }

    private loadControls() {
        if (!this.camera) return;
        this.controls = new PointerLockControls(this.camera, document.body);
        document.addEventListener('click', () => {
            this.controls?.lock();
        });

        document.addEventListener('keydown', (e) => {
            if (e.code == 'Space') this.jump();
            this.updateDirection(e.code, 1);
        });
        document.addEventListener('keyup', (e) => this.updateDirection(e.code, 0));
    }

    private jump() {
        if (!this.isGrounded) return;
        this.velocity.y = Player.JUMP_FORCE;
        this.isGrounded = false;
    }

    private updateDirection(keyCode: string, sign: number) {
        if (sign === 1) {
            this.keysPressed.add(keyCode);
        } else {
            this.keysPressed.delete(keyCode);
        }
    }

    public fixedUpdate(delta: number) {

        // Update name tag position
        if (this.nameTag) {
            this.nameTag.updateLabelContent(
                this.name,
                this.getLocation().clone().add(new THREE.Vector3(0, 2, 0))
            );
        }

        if (!this.isOwner) return;
    
        const direction = new THREE.Vector3();
        this.controls!.getDirection(direction); // Get the forward direction of the camera

        const desiredVelocity = new THREE.Vector3();

        const forward = direction.clone().normalize();
        const right = new THREE.Vector3().crossVectors(this.camera!.up, forward).normalize();

        if (this.keysPressed.has('KeyW')) {
            desiredVelocity.add(forward);
        }
        if (this.keysPressed.has('KeyS')) {
            desiredVelocity.sub(forward);
        }
        if (this.keysPressed.has('KeyA')) {
            desiredVelocity.add(right);
        }
        if (this.keysPressed.has('KeyD')) {
            desiredVelocity.sub(right);
        }
        
        // Normalize the desired velocity and multiply by max speed
        desiredVelocity.normalize().multiplyScalar(this.maxSpeed);

        // Smoothly adjust the current velocity towards the desired velocity
        this.velocity.x += (desiredVelocity.x - this.velocity.x) * this.acceleration;
        this.velocity.z += (desiredVelocity.z - this.velocity.z) * this.acceleration;

        // Apply deceleration when no keys are pressed
        if (!this.keysPressed.has('KeyW') && !this.keysPressed.has('KeyS')) {
            this.velocity.x *= this.deceleration;
            this.velocity.z *= this.deceleration;
        }
    
        // Gravity
        this.velocity.y -= Player.GRAVITY * delta;
    
        // Update position based on velocity
        this.camera?.position.add(this.velocity.clone().multiplyScalar(delta));
    
        // Apply friction (optional)
        this.velocity.x *= 0.9;
        this.velocity.z *= 0.9;
    
        // Basic ground check (for demonstration purposes)
        if (this.camera!.position.y <= Player.HEIGHT) {
            this.isGrounded = true;
            this.camera!.position.y = Player.HEIGHT;
            this.velocity.y = 0;
        } else {
            this.isGrounded = false;
        }

        // move player mesh
        let meshPosition = this.camera!.position.clone();
        this.playerMesh!.position.copy(meshPosition);

        if (this.camera) {
            this.playerMesh!.position.copy(this.camera.position);
            this.playerMesh!.position.y -= Player.HEIGHT / 2; // Adjust to ensure the base of the mesh aligns with the ground
        }

        if (this.onOwnerMove) this.onOwnerMove(this);
    }

    public getLocation(): THREE.Vector3 {
        return this.playerMesh!.position;
    }

    public getLocationVector(): Vector3 {
        const location = this.getLocation();
        return { 
            x: location.x,
            y: location.y,
            z: location.z
        };
    }

    public getRotation(): THREE.Euler {
        // use mesh rotation
        return this.playerMesh!.rotation;
    }

    public getRotationVector(): Vector3 {
        const rotation = this.getRotation();
        return {
            x: rotation.x,
            y: rotation.y,
            z: rotation.z
        };
    }

    public getScale(): THREE.Vector3 {
        return this.camera!.scale;
    }

    public getScaleVector(): Vector3 {
        const scale = this.getScale();
        return {
            x: scale.x,
            y: scale.y,
            z: scale.z
        };
    }

    public getName(): string {
        return this.name;
    }

    public setLocation(location: THREE.Vector3) {
        this.playerMesh!.position.copy(location);
        this.nameTag?.updateLabelContent(
            this.name,
            this.getLocation().clone().add(new THREE.Vector3(0, 2, 0))
        );
    }

    public setRotation(rotation: THREE.Euler) {
        this.playerMesh!.rotation.copy(rotation);
    }

    public getColor(): string {
        return this.color!;
    }

}