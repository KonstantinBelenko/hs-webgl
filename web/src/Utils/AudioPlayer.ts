import { Audio, AudioLoader, AudioListener } from 'three';

export class AudioPlayer {
    private sounds: Audio[] = [];
    private listener: AudioListener;
    private loader: AudioLoader;

    constructor(filePaths: string[]) {
        this.listener = new AudioListener();
        this.loader = new AudioLoader();

        filePaths.forEach((path) => {
            if (!path.endsWith('.ogg')) {
                console.error(`File at path ${path} is not an .ogg file.`);
                return;
            }

            this.loader.load(path, (buffer) => {
                const sound = new Audio(this.listener);
                sound.setBuffer(buffer);
                this.sounds.push(sound);
            });
        });
    }

    playSoundAtIndex(index: number) {
        if (index >= 0 && index < this.sounds.length) {
            this.sounds[index].play();
        } else {
            console.error('Invalid index provided.');
        }
    }

    playRandomSound() {
        const randomIndex = Math.floor(Math.random() * this.sounds.length);
        this.sounds[randomIndex].play();
    }

    playFirstSound() {
        if (this.sounds.length > 0) {
            this.sounds[0].play();
        }
    }
}

// Usage:
// const player = new AudioPlayer(['path1.ogg', 'path2.ogg', 'path3.ogg']);
// player.playSoundAtIndex(1);
// player.playRandomSound();
// player.playFirstSound();
