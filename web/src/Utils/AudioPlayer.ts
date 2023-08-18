import { Audio, AudioLoader, AudioListener } from 'three';

export class AudioPlayer {
    private sounds: Audio[] = [];
    private listener: AudioListener;
    private loader: AudioLoader;

    constructor(filePaths: string[]) {
        this.listener = new AudioListener();
        this.loader = new AudioLoader();
    
        this.sounds = new Array(filePaths.length); // Pre-allocate space
    
        filePaths.forEach((path, index) => {
            if (!path.endsWith('.ogg')) {
                console.error(`File at path ${path} is not an .ogg file.`);
                return;
            }
    
            this.loader.load(path, (buffer) => {
                const sound = new Audio(this.listener);
                sound.setBuffer(buffer);
                this.sounds[index] = sound; // Set the sound at the correct index
            });
        });
    }
    

    playSoundAtIndex(index: number) {
        if (index >= 0 && index < this.sounds.length && this.sounds[index]) {
            const soundToPlay = this.sounds[index];
            soundToPlay.play();
        } else {
            console.error('Invalid index provided.');
        }
    }
    
    playRandomSound() {
        const randomIndex = Math.floor(Math.random() * this.sounds.length);
        if (this.sounds[randomIndex]) {
            const soundToPlay = this.sounds[randomIndex].clone();
            soundToPlay.play();
        }
    }
    
    playFirstSound() {
        if (this.sounds.length > 0 && this.sounds[0]) {
            const soundToPlay = this.sounds[0].clone();
            soundToPlay.play();
        }
    }
    
}

// Usage:
// const player = new AudioPlayer(['path1.ogg', 'path2.ogg', 'path3.ogg']);
// player.playSoundAtIndex(1);
// player.playRandomSound();
// player.playFirstSound();
