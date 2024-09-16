class GameManager {
    constructor() {
        this.username = "";
        this.score = 0;
        this.timer = 15;
        this.timerInterval = null;
        
        this.init();
    }

    init() {
        // Show username pop-up at start
        this.showPopup("usernamePopup");

        document.getElementById('startGame').addEventListener('click', () => {
            this.startGame();
        });

        document.getElementById('restartGame').addEventListener('click', () => {
            this.restartGame();
        });
    }

    showPopup(popupId) {
        document.getElementById(popupId).classList.add('show');
    }

    closePopup(popupId) {
        document.getElementById(popupId).classList.remove('show');
    }

    startGame() {
        // Get the username and start the game
        this.username = document.getElementById('username').value;
        if (this.username === "") return; // Prevent starting without a name

        this.closePopup('usernamePopup');
        this.startTimer();
    }

    startTimer() {
        const timerElement = document.getElementById('timer');
        this.timer = 15; // 1 minute
        timerElement.innerHTML = `Time Left: ${this.timer}s`;

        this.timerInterval = setInterval(() => {
            this.timer--;
            timerElement.innerHTML = `Time Left: ${this.timer}s`;

            if (this.timer <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    incrementScore() {
        this.score++;
    }

    endGame() {
        clearInterval(this.timerInterval);

        // Show game-over pop-up
        this.showPopup('gameOverPopup');
        document.getElementById('scoreDisplay').innerHTML = `Your Score: ${this.score}`;

        // Save score to server
        this.saveScore();
    }

    restartGame() {
        this.score = 0;
        this.startGame();
        this.closePopup('gameOverPopup');
    }

    async saveScore() {
        // Send username and score to the server
        const data = { username: this.username, score: this.score };

        try {
            const response = await fetch('pages/api/saveScore', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                console.log("Score saved successfully!");
            } else {
                console.error("Failed to save score.");
            }
        } catch (error) {
            console.error("Error saving score:", error);
        }
    }
}

// Initialize GameManager
const gameManager = new GameManager();

// Example: Increment score when button is clicked
document.querySelector('.hide').addEventListener('click', () => {
    gameManager.incrementScore();
});
