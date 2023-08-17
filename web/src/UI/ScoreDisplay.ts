export class ScoreDisplay {
    private scoreElement: HTMLDivElement;
    private currentScore: number;

    constructor(initialScore: number = 0) {
        this.currentScore = initialScore;

        // Create score element
        this.scoreElement = document.createElement('div');
        this.scoreElement.className = 'score-display';
        this.scoreElement.textContent = this.currentScore.toString();

        document.body.appendChild(this.scoreElement);

        // Add styles dynamically
        this.addStyles();
    }

    update(newScore: number): void {
        this.currentScore = newScore;
        this.scoreElement.textContent = this.currentScore.toString();
        this.scoreElement.classList.add('score-animation');
        
        // Remove the animation class after the animation duration to allow it to be retriggered
        setTimeout(() => {
            this.scoreElement.classList.remove('score-animation');
        }, 300);  // Assuming the animation duration is 300ms
    }

    show(): void {
        this.scoreElement.style.display = 'block';
    }

    hide(): void {
        this.scoreElement.style.display = 'none';
    }

    private addStyles(): void {
        let style = document.createElement('style');
        style.innerHTML = `
            .score-display {
                position: fixed;
                bottom: 50px;
                left: 50%;
                transform: translateX(-50%);
                padding: 10px 20px;
                background-color: #fff;
                font-size: 24px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                transition: transform 0.3s ease;
            }

            .score-animation {
                transform: translateX(-50%) scale(1.1);
            }
        `;
        document.head.appendChild(style);
    }
}
