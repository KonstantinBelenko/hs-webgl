import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { PlayerCrosshair } from "../UI/PlayerCrosshair.js";
import { PlayerNameTag } from "../UI/PlayerNameTag.js";
import * as CANNON from 'cannon-es';

export class Player {

    private name: string = "";
    private isOwner: boolean = false;
    private scene: THREE.Scene | null = null;

    // camera
    public camera: THREE.PerspectiveCamera | null = null;
    
    // UI
    private nameTag: PlayerNameTag | null = null;   
    private NAME_TAG_OFFSET: number = 1.5;
    
    // Physics
    private velocity: CANNON.Vec3 | null = null;
    private playerBody: CANNON.Body | null = null;
    private playerBodyMesh: THREE.Mesh | null = null;
    private isOnGround: boolean = false;
    
    private JUMP_FORCE: number = 7;
    
    private MAX_SPEED: number = 5;
    private ACCELERATION: number = 2;
    private DECELERATION: number = 1.5;
    private currentSpeed: number = 0;
    
    // Controls
    private isRunning: boolean = false;
    private pointerControls: PointerLockControls | null = null;
    private controls = {
        moveForward: 0,
        moveBackward: 0,
        moveLeft: 0,
        moveRight: 0,
    };
    
    // Mesh
    private PLAYER_HEIGHT: number = 0.9;
    public playerMesh: THREE.Mesh | null = null // The public mesh representing the player
    
    // Callbacks
    private onOwnerMoveCallback: ((player: Player) => void) | null = null;

    constructor(
        name: string, 
        isOwner: boolean, 
        world: CANNON.World,
        scene: THREE.Scene,
        renderer: CSS2DRenderer,
        onOwnerMoveCallback?: (player: Player) => void
    ) {
        this.name = name;
        this.isOwner = isOwner;
        this.scene = scene;

        // Init physics
        this.velocity = new CANNON.Vec3();
        const playerShape = new CANNON.Sphere(0.5);
        this.playerBody = new CANNON.Body({ 
            mass: 5, 
            shape: playerShape,
            position: new CANNON.Vec3(0, 10, 0),
            linearDamping: 0.3,
        });
        world.addBody(this.playerBody);

        this.nameTag = new PlayerNameTag(name, this.playerBody.position.clone().vadd(new CANNON.Vec3(0, this.NAME_TAG_OFFSET, 0)), scene, renderer);
        
        if (isOwner) {
            new PlayerCrosshair("white");
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.initMovementControls();
        }

        // visualize player body
        this.playerBodyMesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 32, 32),
            new THREE.MeshBasicMaterial({ color: "pink" })
        );
        this.scene.add(this.playerBodyMesh);

        if (onOwnerMoveCallback) this.onOwnerMoveCallback = onOwnerMoveCallback;
    }

    private initMovementControls() {
        if (!this.camera) return;

        // Pointer lock controls
        this.pointerControls = new PointerLockControls(this.camera, document.body);
        document.addEventListener('click', () => {
            this.pointerControls?.lock();
        });

        // Jump controls
        document.addEventListener('keydown', (e) => {
            if (e.code == 'Space') this.jump();
        });

        document.addEventListener('keydown', (event) => {
            switch (event.keyCode) {
                case 87: this.controls.moveBackward = 1; break;  // W key
                case 83: this.controls.moveForward = 1; break;  // S key
                case 65: this.controls.moveLeft = 1; break;  // A key
                case 68: this.controls.moveRight = 1; break;  // D key
                // Run on shift
                case 16: this.isRunning = true; break;  // Shift key
            }
        });
        
        document.addEventListener('keyup', (event) => {
            switch (event.keyCode) {
                case 87: this.controls.moveBackward = 0; break;
                case 83: this.controls.moveForward = 0; break;
                case 65: this.controls.moveLeft = 0; break;
                case 68: this.controls.moveRight = 0; break;
                case 16: this.isRunning = false; break;
            }
        });
    }

    private jump() {
        if (this.isOnGround && this.playerBody) {
            this.playerBody.velocity.y = this.JUMP_FORCE;  // Set the y velocity directly
            this.isOnGround = false;
        }
    }

    public fixedUpdate() {
        if (this.isOwner) {
            if (this.playerBody && Math.abs(this.playerBody.velocity.y) < 0.15) {
                this.isOnGround = true;
            } else {
                this.isOnGround = false;
            }
    
            const inputDirection = new THREE.Vector3(this.controls.moveRight - this.controls.moveLeft, 0, this.controls.moveForward - this.controls.moveBackward);
            if (!inputDirection.equals(new THREE.Vector3(0, 0, 0))) {
                inputDirection.normalize();
                inputDirection.applyEuler(this.camera!.rotation);
        
                // Increase the current speed by the acceleration value
                this.currentSpeed = Math.min(this.currentSpeed + this.ACCELERATION, this.MAX_SPEED * (this.isRunning ? 2 : 1));
                this.velocity?.copy(
                    new CANNON.Vec3(inputDirection.x, inputDirection.y, inputDirection.z)
                ).scale(this.currentSpeed, this.velocity);
            } else {
                // Decelerate if no movement input is given
                this.currentSpeed = Math.max(this.currentSpeed - this.DECELERATION, 0);
                // Here, we maintain the direction of velocity, but just scale it down
                this.velocity?.scale(this.currentSpeed / (this.velocity?.length() || 1), this.velocity);
            }
        
            this.playerBody!.velocity.x = this.velocity!.x;
            this.playerBody!.velocity.z = this.velocity!.z;
    
            this.camera!.position.set(this.playerBody!.position.x, this.playerBody!.position.y + this.PLAYER_HEIGHT, this.playerBody!.position.z);
    
            if (this.onOwnerMoveCallback) this.onOwnerMoveCallback(this);
        } else {
            this.playerBody!.velocity.x = 0;
            this.playerBody!.velocity.z = 0;
        }

        this.nameTag?.updatePosition(this.playerBody!.position.clone().vadd(new CANNON.Vec3(0, this.NAME_TAG_OFFSET, 0)));
        this.playerBodyMesh!.position.copy( new THREE.Vector3(
            this.playerBody!.position.x,
            this.playerBody!.position.y,
            this.playerBody!.position.z,
        ));
    }

    public getLocationVector(): { x: number, y: number, z: number } {
        const location = this.playerBody?.position;
        return { 
            x: location!.x,
            y: location!.y,
            z: location!.z
        };
    }

    public getRotationVector(): { x: number, y: number, z: number } {
        const rotation = new CANNON.Vec3(0,0,0);
        this.playerBody?.quaternion.toEuler(rotation);
        return {
            x: rotation.x,
            y: rotation.y,
            z: rotation.z
        };
    }

    public getScaleVector(): { x: number, y: number, z: number } {
        const scale = this.camera!.scale;
        return {
            x: scale.x,
            y: scale.y,
            z: scale.z
        };
    }

    public getName(): string {
        return this.name;
    }

    public setLocation(location: { x: number, y: number, z: number }) {
        this.playerBody?.position.set(location.x, location.y, location.z);
    }

    public setRotation(rotation: THREE.Euler) {
        this.playerBody?.quaternion.setFromEuler(rotation.x, rotation.y, rotation.z);
    }

}