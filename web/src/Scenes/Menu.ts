import * as THREE from 'three';

export class Menu {

    private customVertexShader =  `
        varying vec2 vUv;
        varying float vY;
        uniform float time;
    
        float noise(vec3 pos) {
            // Simple fractal noise
            return fract(sin(dot(pos, vec3(12.9898, 78.233, 37.719))) * 43758.5453123);
        }
    
        void main() {
            vUv = uv;
            
            vec3 pos = position;
            float n = noise(pos + time); // get noise value
            vY = pos.y;
            // Modify the position of the vertex based on noise
            pos += normal * n * 0.1;
        
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `;


    private customFragmentShader = `
        varying float vY;

        void main() {
            // Create a gradient from blue (at bottom) to green (at top)
            vec3 color = mix(vec3(0.0, 0.0, 1.0), vec3(0.0, 1.0, 0.0), vY * 0.5 + 0.5);
            
            gl_FragColor = vec4(color, 1.0);
        }
    `;

    private shaderMaterial: THREE.ShaderMaterial | null = null;

    private scene = new THREE.Scene();
    private renderer = new THREE.WebGLRenderer({ antialias: true });
    private camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    private spinningCubes: THREE.Mesh[] = [];

    constructor(renderer: THREE.WebGLRenderer) {
        this.renderer = renderer;
        this.setupCamera();
        this.setupScene();
        this.setupLights();
    }

    private setupCamera(): void {
        this.camera.position.set(0, 0, -5);
        this.camera.lookAt(0, 0, 0);
    }

    private setupScene(): void {
        const geometry = new THREE.BoxGeometry(1, 1, 1, 50, 50, 50);
        
        // Custom shader material
        this.shaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(0x00ff00) },
                //@ts-ignore
                displacementTexture: { type: "t", value: new THREE.TextureLoader().load("/assets/textures/brick_wall.jpg") },
                displacementScale: { value: 1.0 },
                time: { value: 0.0 }
            },
            vertexShader: this.customVertexShader,
            fragmentShader: this.customFragmentShader
        });
        
    
        this.spinningCubes.push(new THREE.Mesh( geometry, this.shaderMaterial ));
        this.spinningCubes.push(new THREE.Mesh( geometry, this.shaderMaterial ));
    
        this.spinningCubes[0].position.set(-4, 0, 0);
        this.scene.add(this.spinningCubes[0]);
    
        this.spinningCubes[1].position.set(4, 0, 0);
        this.scene.add(this.spinningCubes[1]);
    }
    

    private setupLights(): void {
        const ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 );
        this.scene.add( ambientLight );

        const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
        directionalLight.position.set( 0, 10, 0 );
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.top = 10;
        directionalLight.shadow.camera.bottom = - 10;
        directionalLight.shadow.camera.left = - 10;
        directionalLight.shadow.camera.right = 10;
        this.scene.add( directionalLight );
    }

    public update(): void {
        this.spinningCubes.forEach((cube) => {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
        });
        
        // Update the time uniform for the shader material
        if (this.shaderMaterial != null) {
            this.shaderMaterial.uniforms.time.value += 0.01;
        }
    }
    

    public destroy(): void {
        this.renderer.dispose();
    }

}