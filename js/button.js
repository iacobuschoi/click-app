class ButtonAnimator {
    constructor(element, x, y) {
        this.hide = element;
        this.hideCount = 0;
        this.hideConutLimit = this.randomInt(1, 5);
        this.lastHideX = x;
        this.lastHideY = y;
        this.hideX = x;
        this.hideY = y;
        this.isMove = false;
        this.isHover = false;

        this.init();
    }

    init() {
        this.hide.addEventListener("click", () => {
            this.createNewDivWithButton()
        });
        this.hide.addEventListener("mouseenter", () => {
            this.handleMouseEnter();
        });
        this.initialMove();
        gameManager.incrementScore();
    }

    initialMove() {
        this.isMove = true;
        this.createKeyframes(
            this.hideX,
            this.hideY,
            this.hideX = this.hideX + this.randomInt(-100,100),
            this.hideY = this.hideY + this.randomInt(-100,100),
            'initial-move',
            100,
            0
        );
        this.hide.style.animation = `initial-move .2s linear`;
        this.hide.addEventListener('animationend', () => {
            this.isMove = false;
            this.hide.style.animation = 'none';
            this.hide.style.transition = 'all .1s ease-out';
            this.hide.style.transform = `translateX(${this.hideX}px) translateY(${this.hideY}px)`;
        }, { once: true });
    }

    hideCountInit() {
        this.hideCount = 0;
        this.hideConutLimit = this.randomInt(1, 5);
    }

    randomInt(s, e) {
        return Math.floor(Math.random() * (e - s)) + s;
    }

    createKeyframes(x0, y0, x1, y1, animationName, zValue, rotateValue) {
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerHTML = `
            @keyframes ${animationName} {
                0% {
                    transform: translateX(${x0}px) translateY(${y0}px) translateZ(0px) rotateX(0deg);
                }
                25% {
                    transform: translateX(${(3 * x0 + x1) / 4}px) translateY(${(3 * y0 + y1) / 4}px) translateZ(${zValue * 0.7}px) rotateX(${rotateValue * 0.5}deg);
                }
                50% {
                    transform: translateX(${(x0 + x1) / 2}px) translateY(${(y0 + y1) / 2}px) translateZ(${zValue}px) rotateX(${rotateValue}deg);
                }
                75% {
                    transform: translateX(${(x0 + 3 * x1) / 4}px) translateY(${(y0 + 3 * y1) / 4}px) translateZ(${zValue * 0.7}px) rotateX(${rotateValue * 1.5}deg);
                }
                100% {
                    transform: translateX(${x1}px) translateY(${y1}px) translateZ(0px) rotateX(${zValue*2}deg);
                }
            }
        `;
        document.head.appendChild(styleSheet);
    }

    createNewDivWithButton() {
        console.log("clicked");

        const screen = document.querySelector('.screen');
        const newDiv = document.createElement('div');
        newDiv.classList.add('hide');

        const newButton = document.createElement('button');
        newButton.classList.add('hide-button');
        newButton.innerText = "click";
        newDiv.appendChild(newButton);

        screen.appendChild(newDiv);

        new ButtonAnimator(newDiv, this.hideX, this.hideY);
    }

    handleMouseEnter() {
        if (this.isMove) return;
        this.isMove = true;

        this.lastHideX = this.hideX;
        this.lastHideY = this.hideY;

        this.hideX = this.randomInt(0, window.innerWidth - this.hide.offsetWidth);
        this.hideY = this.randomInt(0, window.innerHeight * 0.9 - this.hide.offsetHeight);
        this.hideCount++;

        if (this.hideCount > this.hideConutLimit) {
            this.hideCountInit();
            const animationName = 'hide-special-move';
            const zValue = 300;
            const rotateValue = 180;
            this.createKeyframes(
                this.lastHideX,
                this.lastHideY,
                this.hideX,
                this.hideY,
                animationName, zValue, rotateValue
            );
            this.hide.style.animation = `${animationName} .3s linear`;
            this.hide.addEventListener('animationend', () => {
                this.isMove = false;
                this.hide.style.animation = 'none';
                this.hide.style.transition = 'all .1s ease-out';
                this.hide.style.transform = `translateX(${this.hideX}px) translateY(${this.hideY}px)`;
            }, { once: true });
        } else {
            this.hide.style.transition = `all ${0.1*this.hideCount}s ease-out`;
            this.hide.style.transform = `translateX(${this.hideX}px) translateY(${this.hideY}px)`;
            this.hide.addEventListener('transitionend', () => {
                this.isMove = false;
            });
        }
    }
}

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
}

const gameManager = new GameManager();
const initialButton = document.querySelector('.hide');
new ButtonAnimator(initialButton, window.innerWidth/2, window.innerHeight/2);