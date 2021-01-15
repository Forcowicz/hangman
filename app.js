'use strict';

const hangmanImage = document.getElementById('hangmanImage');
const guessBtn = document.getElementById('guessBtn');
const resetBtn = document.getElementById('newGameBtn');
const guessInput = document.getElementById('guessInput');
const userWordInput = document.getElementById('userWordInput');
const userWordInputLabel = document.querySelector('label');
const inputGroup = document.querySelector('.input-group');
const lettersContainer = document.getElementById('lettersContainer');
const gameOverScreen = document.getElementById('gameOver');
const statsBox = document.querySelector('.stats-box');
const statsElements = document.querySelectorAll('.stats-box > span > b');
const hint = document.getElementById('hint');

let lettersDOM;

const generateRandomWord = function() {
    const randomWords = {
        noun: ['inspector', 'grass', 'toilet', 'sympathy', 'driver', 'resolution', 'funeral', 'branch', 'core', 'failure', 'twilight', 'simplicity', 'reactor', 'hospital', 'game', 'force', 'moral', 'solid', 'battle', 'female'],
        verb: ['sweeping', 'shooting', 'running', 'eating', 'dancing', 'realizing', 'reinforcing', 'promote', 'driving', 'swimming', 'crawling', 'working', 'jogging', 'flying', 'returning', 'stealing', 'yelling', 'shouting', 'singing', 'sleeping'],
        adjective: ['yellow', 'dangerous', 'gray', 'deadly', 'immobile', 'weird', 'dizzy', 'flappy', 'funny', 'pathetic', 'nice', 'small', 'big', 'enormous', 'hard-working', 'hilarious', 'trustworthy', 'lazy', 'invisible', 'invicible', 'fast', 'slow', 'tiny', 'tall', 'short', 'numeric']
    };
    const types = ['noun', 'verb', 'adjective'];
    const randomNumberType = Math.trunc(Math.random() * 3);
    const category = types[randomNumberType];
    const randomNumberWord = Math.trunc(Math.random() * randomWords[category].length) + 1;
    game.category = category;
    return randomWords[category][randomNumberWord];
};

const game = {
    word: null,
    letters: null,
    gameOver: false,
    stage: 0,
    phase: 0,
    hits: 0,
    mistakes: 0,
    triedWords: [],
    category: null,

    endGame(result) {
        this.gameOver = true;

        if(result === 'lost') {
            lettersDOM.forEach((letter) => {
                letter.classList.remove("letter--hidden");
            });

            hangmanImage.classList.add("hangman-gameover");
            gameOverScreen.classList.add("gameover-screen--lost");
            gameOverScreen.textContent = "You lost :(";
        } else if(result === 'win') {
            hangmanImage.classList.add("hangman-gameover");
            gameOverScreen.classList.add("gameover-screen--win");
            gameOverScreen.textContent = "You won :)";
        }
        
        gameOverScreen.style.display = "flex";
        gameOverScreen.style.animation = "zoomIn .5s ease-in";
        guessInput.style.display = 'none';
        guessBtn.style.display = 'none';
        statsBox.style.display = 'flex';

        this.endTime = performance.now();
        const timeDifference = Math.trunc((this.endTime - this.startTime) / 1000);
        const {stage, mistakes} = this;
        const [stageElement, mistakesElement, timeElement] = statsElements;
        stageElement.textContent = `${stage + 1}/12`;
        mistakesElement.textContent = mistakes;
        timeElement.textContent = `${timeDifference} seconds`;
    },

    init() {
        game.word = null;
        game.stage = 0;
        game.mistakes = 0;
        game.gameOver = false;
        game.letters = null;
        game.phase = 0;
        game.hits = 0;
        game.triedWords = [];
        game.startTime = null;
        game.endTime = null;
        game.category = null;
        lettersContainer.innerHTML = 
                `<div class="letter-group">
                    <span class="letter">t</span>
                    <span class="letter">h</span>
                    <span class="letter">e</span>
                </div>
                <div class="letter-group">
                    <span class="letter">h</span>
                    <span class="letter">a</span>
                    <span class="letter">n</span>
                    <span class="letter">g</span>
                    <span class="letter">m</span>
                    <span class="letter">a</span>
                    <span class="letter">n</span>
                </div>
                <div class="letter-group">
                    <span class="letter">g</span>
                    <span class="letter">a</span>
                    <span class="letter">m</span>
                    <span class="letter">e</span>
                </div>`;
        guessInput.style.display = 'block';
        statsBox.style.display = 'none';
        gameOverScreen.style.display = 'none';
        guessInput.value = '';
        inputGroup.style.display = 'block';
        guessBtn.style.display = 'block';
        guessBtn.textContent = 'Start';
        hangmanImage.style.display = 'none';
        userWordInput.value = '';
        hangmanImage.classList.remove('hangman-gameover');
        if(document.querySelector('body').classList.contains('dark')) {
            gameOverScreen.className = 'gameover-screen dark';
        } else {
            gameOverScreen.className = 'gameover-screen';
        }
        gameOverScreen.removeAttribute('style');
        hangmanImage.src = 'hangman-0.jpg';
        hint.style.display = 'none';
    } 
};

game.init();

document.addEventListener('keypress', function(e) {
    if(e.code === 'Enter') guessBtn.click();
});

guessBtn.addEventListener('click', () => {
    if(!game.gameOver) {
        if (game.phase === 0) {
            // If the user input is empty, get a random word

            if (userWordInput.value[0] === ' ' || userWordInput.value[userWordInput.value.length - 1] === ' ') {
                userWordInputLabel.textContent = 'Your word cannot have space at the beginning or at the end!';
                userWordInput.focus();
                guessBtn.setAttribute('disabled', true);
                setTimeout(() => {
                    userWordInputLabel.textContent = 'Enter a desired word to guess (if empty, a random word will be generated)';
                    guessBtn.removeAttribute('disabled');
                }, 3000);
                return;
            } else if(userWordInput.value) {
                let whitespace = 0;
                for (const char of userWordInput.value) {
                    if (char === ' ') whitespace++;
                }

                game.word = whitespace === userWordInput.value.length ? generateRandomWord() : userWordInput.value.toLowerCase();
            } else {
                game.word = generateRandomWord();
            }

            // Set start time
            game.startTime = performance.now();

            // Set hint based on game.category
            if(game.category) {
                hint.style.display = "inline-block";
                hint.textContent = `Category: ${game.category}`;
            }

            guessBtn.textContent = 'Guess';
            let str = "<div class='letter-group'>";
            game.word = [...game.word];
            inputGroup.style.display = 'none';
            hangmanImage.style.display = 'block';

            for (const letter of game.word) {
                str += letter === ' ' ? "</div><div class='letter-group'>" : `<span class='letter letter--hidden'>${letter}</span>`;
            }

            str += '</div>';
            lettersContainer.innerHTML = str;

            // Remove whitespaces from the word
            if(game.word.includes(' ')) {
                let newWord = '';
                for (const char of game.word) {
                    if (char === ' ') continue;
                    newWord += char;
                }
                game.word = newWord;
            }

            game.phase = 1;
        } else if (game.phase === 1) {
            // Main game
            const guess = guessInput.value.toLowerCase();
            lettersDOM = document.querySelectorAll('.letter');
            if (game.word.includes(guess) && !game.triedWords.includes(guess)) {
                let i = 0;
                while (i < game.word.length) {
                    if (lettersDOM[i].textContent === guess) {
                        lettersDOM[i].classList.remove('letter--hidden');
                        game.hits++;
                    }
                    i++
                }

                game.triedWords.push(guess);
                if (game.hits === game.word.length) {
                    game.endGame('win');
                }
            } else if (guessInput.value) {
                game.stage++;
                game.mistakes++;
                if (game.stage >= 11) {
                    game.endGame('lost');
                    hangmanImage.src = 'hangman-11.jpg';
                } else {
                    hangmanImage.src = `hangman-${game.stage}.jpg`;
                }
            }
            guessInput.value = '';
        }
    }
});

resetBtn.addEventListener('click', game.init);
