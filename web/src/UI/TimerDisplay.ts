export class TimerDisplay {
    private timerElement: HTMLDivElement;
    private currentTime: number;

    constructor(initialTime: number = 0) {
        this.currentTime = initialTime;

        // Create timer element
        this.timerElement = document.createElement('div');
        this.timerElement.className = 'timer-display';
        this.timerElement.textContent = this.formatTime(this.currentTime);

        document.body.appendChild(this.timerElement);

        // Add styles dynamically
        this.addStyles();
    }

    update(newTime: number): void {
        this.currentTime = newTime;
        this.timerElement.textContent = this.formatTime(this.currentTime);

        // Apply animation
        this.timerElement.classList.add('timer-animation');
        
        setTimeout(() => {
            this.timerElement.classList.remove('timer-animation');
        }, 300);  // Assuming the animation duration is 300ms

        // If time is 3 seconds or less, increase font size
        if (this.currentTime <= 3) {
            this.timerElement.classList.add('timer-warning');
        } else {
            this.timerElement.classList.remove('timer-warning');
        }
    }

    private formatTime(milliseconds: number): string {
        let seconds = Math.floor(milliseconds / 1000);
        let minutes = Math.floor(seconds / 60);
        let remainingSeconds = seconds % 60;
    
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    

    private addStyles(): void {
        let style = document.createElement('style');
        style.innerHTML = `
            .timer-display {
                position: fixed;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
                padding: 10px 20px;
                font-size: 24px;
                color: white;
                transition: transform 0.3s ease;
            }

            .timer-animation {
                transform: translateX(-50%) scale(1.1);
            }

            .timer-warning {
                font-size: 36px;  // Increase font size
                color: red;
            }
        `;
        document.head.appendChild(style);
    }
}
