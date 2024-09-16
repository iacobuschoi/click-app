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
            const zValue = 500;
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

const initialButton = document.querySelector('.hide');
new ButtonAnimator(initialButton, window.innerWidth/2, window.innerHeight/2);