export class TaggedIndicator {
    private div: HTMLDivElement;

    constructor() {
        this.div = document.createElement('div');

        this.div.style.width = '100vw'; // Screen width
        this.div.style.height = '100vh'; // Screen height
        this.div.style.position = 'fixed'; // Fix the position
        this.div.style.top = '0'; // Start from the top
        this.div.style.left = '0'; // Start from the left
        this.div.style.zIndex = '9999'; // Ensure it's on top of other elements
        this.div.style.opacity = '0'; // Initially hidden
        this.div.style.pointerEvents = 'none';

        const img = document.createElement('img');
        img.src = '/assets/textures/red.png';
        img.style.width = '100%'; // Make the image fill the div
        img.style.height = '100%'; // Adjust height based on the image
        img.style.pointerEvents = 'none'; // Ensure no user interactions
        img.style.objectFit = 'fill';

        this.div.appendChild(img);

        document.body.appendChild(this.div);
    }

    // Function to show the image
    show() {
        this.insertKeyframes('fadeIn', [
            { opacity: '0', offset: 0 },
            { opacity: '1', offset: 0.4 },
            { opacity: '0.5', offset: 1 }
        ]);
        this.div.style.animation = 'fadeIn 1s forwards';
    }

    // Function to hide the image
    hide() {
        this.div.style.opacity = '0';
        this.div.style.animation = ''; // Remove the animation
    }

    private insertKeyframes(name: string, frames: { opacity: string, offset: number }[]) {
        const styleSheet: CSSStyleSheet = document.styleSheets[0] as CSSStyleSheet;
        let keyframes = `@keyframes ${name} {`;
        for (const frame of frames) {
            keyframes += `${frame.offset * 100}% { opacity: ${frame.opacity}; }`;
        }
        keyframes += '}';
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
    }
}
