type PlayerScore = {
    name: string;
    score: number;
};

export class LiveScoreDisplay {
    private scoreElement: HTMLUListElement;
    private scores: PlayerScore[] = [];
    private ownerName: string; // Store the owner player's name

    constructor(ownerName: string) {
        this.ownerName = ownerName;
    
        // Create score element
        this.scoreElement = document.createElement('ul');
        this.scoreElement.className = 'live-score-display';
    
        // Adjust the position to bottom right
        this.scoreElement.style.position = 'fixed';
        this.scoreElement.style.bottom = '10px';
        this.scoreElement.style.right = '10px';
    
        document.body.appendChild(this.scoreElement);
    
        // Add styles dynamically
        this.addStyles();
    }
    

    update(scoreList: PlayerScore[]): void {
        this.scores = scoreList.sort((a, b) => b.score - a.score); // Sort scores in descending order
    
        // Clear existing scores
        this.scoreElement.innerHTML = '';
    
        // Add new scores
        for (let i = 0; i < this.scores.length; i++) {
            let listItem = document.createElement('li');
            
            // If the player is the owner, prepend the arrow
            let displayName = this.scores[i].name === this.ownerName ? `-> ${this.scores[i].name}` : this.scores[i].name;
            
            listItem.textContent = `${displayName}: ${this.scores[i].score}`;
    
            // Highlight the top player in gold
            if (i === 0) {
                listItem.classList.add('top-player');
            }
    
            // Highlight the owner player
            if (this.scores[i].name === this.ownerName) {
                listItem.classList.add('owner-player');
            }
    
            this.scoreElement.appendChild(listItem);
        }
    }
    

    show(): void {
        this.scoreElement.style.display = 'flex';
    }

    hide(): void {
        this.scoreElement.style.display = 'none';
    }

    private addStyles(): void {
        let style = document.createElement('style');
        style.innerHTML = `
            .live-score-display {
                position: fixed;
                bottom: 10px;  // Adjusted this to 10px for a small gap from the bottom
                right: 10px;   // Added this to position it to the right
                max-width: 150px;
                padding: 5px 10px;
                font-size: 14px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                background-color: white;
                list-style: none;
                margin: 0;
                padding: 10px 20px;
                overflow: hidden;
                text-overflow: ellipsis;
                align-items: center;
                flex-direction: column;
            }
    
            .score-display li {
                margin-bottom: 3px;
                white-space: nowrap;
            }
    
            .top-player {
                color: gold;
            }
    
            .owner-player {
                font-weight: bold;
                text-decoration: underline;
            }
        `;
        document.head.appendChild(style);
    }
    
}
