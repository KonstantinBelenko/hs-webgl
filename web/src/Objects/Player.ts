import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { PlayerCrosshair } from "../UI/PlayerCrosshair.js";
import { PlayerNameTag } from "../UI/PlayerNameTag.js";
import * as CANNON from 'cannon-es';
import { PlayerLookInteraction } from "../Interaction/PlayerLookInteraction.js";
import { CameraBop } from '../Interaction/CameraBop.js';
import { AudioPlayer } from "../Utils/AudioPlayer.js";
import { SettingsMenu } from "../UI/SettingsMenu.js";

export class Player {

    // General
    private name: string = "";
    private isOwner: boolean = false;
    private scene: THREE.Scene | null = null;

    // Game mechanics
    private gameStarted: boolean = false;
    private gameOver: boolean = false;
    private IsTagged = false;
    private lookingAtPlayer: Player | null = null;

    // camera
    public camera: THREE.PerspectiveCamera | null = null;
    
    // UI
    private cameraBop: CameraBop | null = null;
    private nameTag: PlayerNameTag | null = null;   
    private NAME_TAG_OFFSET: number = 1.5;
    private crosshair: PlayerCrosshair | null = null;

    // Sounds
    public audioPlayer: AudioPlayer | null = null;

    // Physics
    private velocity: CANNON.Vec3 | null = null;
    private playerBody: CANNON.Body | null = null;
    private playerBodyMesh: THREE.Mesh | null = null;
    
    private jumpCount: number = 0;
    private MAX_JUMPS: number = 2;
    private JUMP_FORCE: number = 7;
    private isCollidingWithGround: boolean = false;
    
    private MAX_SPEED: number = 5;
    private ACCELERATION: number = 2;
    private DECELERATION: number = 1.5;
    private currentSpeed: number = 0;
    
    // Controls
    private settingsMenu: SettingsMenu | null = null;
    private sensetivity: number | null = null;
    private isStunned: boolean = false;
    private playerLookInteraction: PlayerLookInteraction | null = null;
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
    
    // Callbacks
    private onOwnerMoveCallback: ((player: Player) => void) | null = null;
    private onOwnerTaggedCallback: ((taggedPlayerName: string, taggerPlayerName: string) => void) | null = null;
    private onOwnerStartGameCallback: (() => void) | null = null;

    constructor(
        name: string, 
        isOwner: boolean,
        isAdmin: boolean,
        world: CANNON.World,
        scene: THREE.Scene,
        renderer: CSS2DRenderer,
        settingsMenu?: SettingsMenu,
        otherPlayers?: Player[],
        onOwnerMoveCallback?: (player: Player) => void,
        onOwnerTaggedCallback?: (taggedPlayerName: string, taggerPlayerName: string) => void,
        onOwnerStartGameCallback?: () => void,
    ) {
        this.name = name;
        this.isOwner = isOwner;
        this.scene = scene;
        if (onOwnerStartGameCallback) this.onOwnerStartGameCallback = onOwnerStartGameCallback;

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
            if (settingsMenu) this.settingsMenu = settingsMenu;
            this.cameraBop = new CameraBop(0.01, 10);
            this.crosshair = new PlayerCrosshair("white");
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            if (otherPlayers) {
                this.playerLookInteraction = new PlayerLookInteraction(
                    this.camera,
                    this.crosshair,
                    otherPlayers
                )
            }
            this.initMovementControls();
            this.sensetivity = settingsMenu!.getMouseSensitivity();
            this.pointerControls!.pointerSpeed = this.sensetivity as number;
            this.audioPlayer = new AudioPlayer([
                "/assets/sfx/stun.ogg",
                "/assets/sfx/jump.ogg",
                "/assets/sfx/tag.ogg",
                "/assets/audio/desert.ogg",
            ]);
            setTimeout(() => {
                this.audioPlayer?.playSoundAtIndex(3, true);
            }, 1000);

            // Player ground collision
            world.addEventListener('beginContact', (event: any) => {
                this.isCollidingWithGround = true;
                this.jumpCount = 0;
            });
            
            world.addEventListener('endContact', (event: any) => {
                this.isCollidingWithGround = false;
            });

            // document on mouseSensitivityChanged
            document.addEventListener('mouseSensitivityChanged', (event: any) => {
                this.pointerControls!.pointerSpeed = event.detail.mouseSensitivity;
            });
        }

        // visualize player body
        this.playerBodyMesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 32, 32),
            new THREE.MeshBasicMaterial({ color: "green" })
        );
        this.scene.add(this.playerBodyMesh);

        if (onOwnerMoveCallback) this.onOwnerMoveCallback = onOwnerMoveCallback;
        if (onOwnerTaggedCallback) this.onOwnerTaggedCallback = onOwnerTaggedCallback;
    }

    private initMovementControls() {
        if (!this.camera) return;

        // Pointer lock controls
        this.pointerControls = new PointerLockControls(this.camera, document.body);
        this.pointerControls.pointerSpeed = this.sensetivity as number;
        document.addEventListener('click', () => {
            if (this.gameOver || this.isStunned || this.settingsMenu!.isOpen()) return;

            this.pointerControls?.lock();

            if (this.lookingAtPlayer !== null && this.IsTagged) {
                this.IsTagged = false;
                this.lookingAtPlayer.setTagged(true);
                this.playerLookInteraction?.setDefaultActionUI();
                if (this.onOwnerTaggedCallback) {
                    this.audioPlayer?.playSoundAtIndex(2);
                    this.onOwnerTaggedCallback(this.lookingAtPlayer.getName(), this.name);
                }
            } 
        });

        // Jump controls
        document.addEventListener('keydown', (e) => {
            if (this.gameOver || this.isStunned) return;
            if (e.code == 'Space') this.jump();
        });

        document.addEventListener('keydown', (event) => {
            if (this.gameOver || this.isStunned) return;
            switch (event.keyCode) {
                case 87: this.controls.moveBackward = 1; break;  // W key
                case 83: this.controls.moveForward = 1; break;  // S key
                case 65: this.controls.moveLeft = 1; break;  // A key
                case 68: this.controls.moveRight = 1; break;  // D key
                // Run on shift
                case 16: this.isRunning = true; break;  // Shift key
                // Start game on F2
                case 113: if (this.onOwnerStartGameCallback && !this.gameStarted) this.onOwnerStartGameCallback();
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
        if (this.isCollidingWithGround || this.jumpCount < this.MAX_JUMPS) {
            this.audioPlayer?.playSoundAtIndex(1);
            this.playerBody!.velocity.y = this.JUMP_FORCE;
            this.jumpCount++;
        }
    }

    public fixedUpdate(delta: number) {
        if (this.isOwner) {
            if (this.isStunned) {
                this.playerBody!.velocity.x = 0;
                this.playerBody!.velocity.z = 0;
            } else {
                const inputDirection = new THREE.Vector3(this.controls.moveRight - this.controls.moveLeft, 0, this.controls.moveForward - this.controls.moveBackward);
                if (!inputDirection.equals(new THREE.Vector3(0, 0, 0))) {
                    inputDirection.normalize();
                    inputDirection.applyEuler(this.camera!.rotation);
            
                    // Increase the current speed by the acceleration value
                    let maxSpeed = this.IsTagged ? this.MAX_SPEED : this.MAX_SPEED + this.MAX_SPEED * 0.10;
                    this.currentSpeed = Math.min(this.currentSpeed + this.ACCELERATION, maxSpeed * (this.isRunning ? 2 : 1));
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

                let bopOffset = { x: 0, y: 0, z: 0 }
                if (this.isCollidingWithGround && this.cameraBop) {
                    bopOffset = this.cameraBop.update(delta, this.currentSpeed);
                }
                let newPosY = this.playerBody!.position.y + this.PLAYER_HEIGHT + bopOffset.y;
                
                this.camera!.position.set(this.playerBody!.position.x, newPosY, this.playerBody!.position.z);

                if (this.IsTagged) {
                    if (this.playerLookInteraction) {
                        this.lookingAtPlayer = this.playerLookInteraction.checkPlayerLook();
                    }
                }

                if (this.onOwnerMoveCallback) this.onOwnerMoveCallback(this);
            }
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

        if (this.getTagged()) {
            this.playerBodyMesh!.material = new THREE.MeshBasicMaterial({ color: "red" });
        } else {
            this.playerBodyMesh!.material = new THREE.MeshBasicMaterial({ color: "green" });
        }
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

    public getMesh(): THREE.Mesh {
        if (!this.playerBodyMesh) throw new Error("Player body mesh is null");
        return this.playerBodyMesh;
    }

    public getTagged(): boolean {
        return this.IsTagged;
    }

    public setTagged(tagged: boolean) {
        this.IsTagged = tagged;
    }

    public setGameStarted(gameStarted: boolean) {
        this.gameStarted = gameStarted;
    }

    public setGameOver(gameOver: boolean) {
        this.gameOver = gameOver;
    }

    public unlockPointerControls() {
        this.pointerControls?.unlock();
    }

    public stun(seconds: number) {
        this.isStunned = true;
        this.isRunning = false;  // Reset the running state
        this.controls = {
            moveForward: 0,
            moveBackward: 0,
            moveLeft: 0,
            moveRight: 0,
        }
        this.audioPlayer?.playSoundAtIndex(0);
        setTimeout(() => {
            this.isStunned = false;
        }, seconds * 1000);
    }

    public togglePointerControls() {
        if (this.pointerControls?.isLocked) {
            this.pointerControls.unlock();
        } else {
            this.pointerControls?.lock();
        }
    }
}