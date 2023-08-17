type PlayerScore = {
    name: string,
    score: number
};

export class EndGameMenu {
    private modal: HTMLDivElement;
    private table: HTMLTableElement;
    private restartButton?: HTMLButtonElement;
    private scores: PlayerScore[];

    constructor(scores: PlayerScore[], restartButton: boolean) {
        this.scores = scores;

        // Create modal elements
        this.modal = document.createElement('div');
        this.modal.id = 'endGameModal';
        this.modal.className = 'end-game-modal';

        let modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        this.modal.appendChild(modalContent);

        this.table = document.createElement('table');
        modalContent.appendChild(this.table);

        if (restartButton) {
            this.restartButton = document.createElement('button');
            this.restartButton.id = 'restartButton';
            this.restartButton.textContent = 'Restart';
            modalContent.appendChild(this.restartButton);

            this.restartButton.addEventListener('click', this.restartGame.bind(this));
        }
        
        this.populateScores();
        document.body.appendChild(this.modal);

        // Add styles dynamically
        this.addStyles();

        // Display the modal
        this.modal.style.display = 'block';
    }

    private populateScores(): void {
        this.scores.sort((a, b) => b.score - a.score);

        let maxScore = this.scores[0].score;
        
        this.scores.forEach(player => {
            let row = document.createElement('tr');
            
            let nameCell = document.createElement('td');
            nameCell.textContent = player.name;
            row.appendChild(nameCell);
            
            let scoreCell = document.createElement('td');
            scoreCell.textContent = player.score.toString();
            row.appendChild(scoreCell);

            if (player.score < 0) {
                row.classList.add('red');
            }

            if (player.score === maxScore) {
                row.classList.add('gold');
            }

            this.table.appendChild(row);
        });
    }

    private restartGame(): void {
        // Close the modal
        this.modal.style.display = 'none';
        // Add any game restart logic you need here.
    }

    private addStyles(): void {
        let style = document.createElement('style');
        style.innerHTML = `
            .end-game-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                z-index: 1000;
            }

            .modal-content {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                padding: 40px; /* Increased padding */
                background-color: #fff;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                width: 60%; /* Set width to 60% of viewport */
                max-width: 800px; /* Set a maximum width */
                overflow: auto; /* Add scroll if content overflows */
            }

            table {
                width: 100%;
                border-collapse: collapse;
            }

            table td, table th {
                padding: 15px; /* Increased padding */
                border-bottom: 1px solid #ddd;
            }

            table tr.gold {
                background-color: gold;
            }

            table tr.red {
                color: red;
            }
        `;
        document.head.appendChild(style);
    }
}