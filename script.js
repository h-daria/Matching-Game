this.validateForm();

class MatchGrid {
    constructor(mode, limit, theme, size, cards) {
        this.mode = mode;
        this.limit = limit;
        this.theme = theme;
        this.size = size;
        this.remainingTime = limit;
        this.timer = document.getElementById('time-info');
        this.cardsArray = cards;
        this.countDown = 0;
    }

    changeGameStylesYellow() {
        let rootStyles = document.querySelector(':root');
        rootStyles.style.setProperty('--darkBackground', '#F49D1A');
        rootStyles.style.setProperty('--lightBackground', '#ffe779');
        rootStyles.style.setProperty('--popUpTextColor', '#FF6D00');
        rootStyles.style.setProperty('--borderColor', '#df8f17');
        rootStyles.style.setProperty('--replayButtonBackground', '#ffb236');
        rootStyles.style.setProperty('--startButtonHover', '#e7bc10');
        rootStyles.style.setProperty('--attentionColor', '#DC3535');
        rootStyles.style.setProperty('--cardFaceHover', '#dc4e35');
        rootStyles.style.setProperty('--cardBackground', '#ffdca4');
    }
    changeGameStylesPurple() {
        let rootStyles = document.querySelector(':root');
        rootStyles.style.setProperty('--darkBackground', '#A31ACB');
        rootStyles.style.setProperty('--lightBackground', '#F273E6');
        rootStyles.style.setProperty('--popUpTextColor', '#3D1766');
        rootStyles.style.setProperty('--borderColor', '#1A0000');
        rootStyles.style.setProperty('--replayButtonBackground', '#CF4DCE');
        rootStyles.style.setProperty('--startButtonHover', '#C780FA');
        rootStyles.style.setProperty('--attentionColor', '#6F1AB6');
        rootStyles.style.setProperty('--cardFaceHover', '#A31ACB');
        rootStyles.style.setProperty('--cardBackground', '#C780FA');
    }
    startGame() {
        this.cardToCheck = null;
        this.remainingTime = this.limit;
        this.matchedCards = [];
        this.busy = true;
        setTimeout(() => {
            this.shuffleCards();
            this.busy = false;
        }, 500);
        this.hideCards();
        this.timer.innerHTML = this.remainingTime;
    }
    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        })
    }
    flipTheCard(card) {
        if(this.mayFlipCard(card)) {
            card.classList.add('visible');

            if(this.cardToCheck) {
                this.checkCardsMatch(card);
            } else {
                this.cardToCheck = card;
            }
        }
    }
    checkCardsMatch(card) {
        if(this.getCardValue(card) === this.getCardValue(this.cardToCheck)) {
            this.cardsMatch(card, this.cardToCheck);
        } else {
            this.cardsNotMatch(card, this.cardToCheck);
        }

        this.cardToCheck = null;
    }
    cardsMatch(firstCard, secondCard) {
        this.matchedCards.push(firstCard);
        this.matchedCards.push(secondCard);
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');

        if(this.matchedCards.length === this.cardsArray.length) {
            this.victory();
        }
    }
    cardsNotMatch(firstCard, secondCard) {
        this.busy = true;
        setTimeout(() => {
            firstCard.classList.remove('visible');
            secondCard.classList.remove('visible');
            this.busy = false;
        }, 1000)
    }
    getCardValue(card) {
       return card.getElementsByClassName('card-id')[0].innerText;
    }
    
    gameOver() {
        clearInterval(this.countDown);
        document.getElementById('game-over-message').classList.add('visible');
    }
    victory() {
        clearInterval(this.countDown);
        document.getElementById('win-message').classList.add('visible');
    }
    shuffleCards() {
        for(let i = this.cardsArray.length - 1; i > 0; i--) {
            let randomCardIndex = Math.floor(Math.random() * (i + 1));
            this.cardsArray[randomCardIndex].style.order = i;
            this.cardsArray[i].style.order = randomCardIndex;
        }
    }
    mayFlipCard(card) {
        return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    }
}

let newGame = new MatchGrid();

function startTheGame() {
    let popUp = document.getElementById('welcome-message');
    let modes = document.getElementsByName('mode');
    let limits = document.getElementsByName('limit');
    let themes = document.getElementsByName('theme');
    let sizes = document.getElementsByName('size');
    let cards = Array.from(document.getElementsByClassName('card'));

    let gameMode = '';
    let gameLimit = '';
    let gameTheme = '';
    let gameSize = '';

    modes.forEach(mode => {
        if(mode.checked) {
            gameMode = mode.value;
            
            if(gameMode === '12') {
                let cardsToRemove = cards.splice(12, 4);
                cardsToRemove.forEach( card => {
                    card.parentNode.removeChild(card);
                })
            }
        }
    });
    limits.forEach(limit => {
        if(limit.checked) {
            gameLimit = limit.value;
        }
    });
    themes.forEach(theme => {
        if(theme.checked) {
            gameTheme = theme.value;
        }
    });
    sizes.forEach(size => {
        if(size.checked) {
            gameSize = size.value;
        }
        if(gameSize === '10') {
            cards.forEach(card => {
                card.classList.remove('normalCard');
                card.classList.add('biggerCard');
            })
        } else {
            cards.forEach(card => {
                card.classList.remove('biggerCard');
                card.classList.add('normalCard');
            })
        }
    });
    
    newGame = new MatchGrid(gameMode, gameLimit, gameTheme, gameSize, cards);
    if(gameTheme === 'purple') {
        newGame.changeGameStylesPurple();
    } else {
        newGame.changeGameStylesYellow();
    }
    popUp.classList.add('invisible');
    newGame.startGame();
    cards.forEach(card => {
        card.addEventListener('click', () => {
            newGame.flipTheCard(card);
        });
    });

    let field = document.getElementById('game-content-container');
    field.addEventListener('mouseenter', setTimer);
    field.addEventListener('mouseleave', clearTimer);
}
function setTimer() {
    newGame.countDown = setInterval(() => {
        newGame.remainingTime--;
        newGame.timer.innerHTML = newGame.remainingTime;
        if(newGame.remainingTime === 0) {
            newGame.gameOver();
        }
    }, 1000)
}
function clearTimer() {
    clearInterval(newGame.countDown);
}

function replayTheGame() {
    document.getElementById('game-over-message').classList.remove('visible');
    document.getElementById('win-message').classList.remove('visible');
    document.getElementById('welcome-message').classList.remove('invisible');
}



function validateForm() {
    let firstSetting = document.querySelector('.settingsMode');
    let secondSetting = document.querySelector('.settingsTheme');
    let thirdSetting = document.querySelector('.settingsLimit');
    let forthSetting = document.querySelector('.settingsSize')
    let firstSettingChecked = false;
    let secondSettingChecked = false;
    let thirdSettingChecked = false;
    let forthSettingChecked = false;
    let startButton = document.querySelector('.start-button');
    
    firstSetting.addEventListener('click', () => {
        firstSettingChecked = true;
        if(firstSettingChecked && secondSettingChecked && thirdSettingChecked) {
            startButton.removeAttribute('disabled');
        }
    });
    secondSetting.addEventListener('click', () => {
        secondSettingChecked = true;
        if(firstSettingChecked && secondSettingChecked && thirdSettingChecked) {
            startButton.removeAttribute('disabled');
        }
    });
    thirdSetting.addEventListener('click', () => {
        thirdSettingChecked = true;
        if(firstSettingChecked && secondSettingChecked && thirdSettingChecked) {
            startButton.removeAttribute('disabled');
        }
    });
    forthSetting.addEventListener('click', () => {
        forthSettingChecked = true;
        if(firstSettingChecked && secondSettingChecked && thirdSettingChecked && forthSettingChecked) {
            startButton.removeAttribute('disabled');
        }
    });
}

var cards = document.querySelectorAll('.card');
function animateCard(el, scale, duration, elasticity) {
  anime.remove(el);
  anime({
    targets: el,
    scale: scale,
    duration: duration,
    elasticity: elasticity
  });
}

function enterCard(el) {
  animateCard(el, 1.1, 800, 400)
};

function leaveCard(el) {
  animateCard(el, 1.0, 600, 300)
};

for (var i = 0; i < cards.length; i++) {
  cards[i].addEventListener('mouseenter', function(e) {
    enterCard(e.target);
  }, false);
  
  cards[i].addEventListener('mouseleave', function(e) {
    leaveCard(e.target)
  }, false);  
}
