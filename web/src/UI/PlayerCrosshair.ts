export class PlayerCrosshair {

    crosshair: HTMLDivElement;

    constructor(color: string) {
        this.crosshair = document.createElement('div');
        this.crosshair.style.width = '5px';
        this.crosshair.style.height = '5px';
        this.crosshair.style.background = color;
        this.crosshair.style.borderRadius = '50%';
        this.crosshair.style.position = 'absolute';
        this.crosshair.style.left = '50%';
        this.crosshair.style.top = '50%';
        this.crosshair.style.transform = 'translate(-50%, -50%)';
        document.body.appendChild(this.crosshair);
    }

}