'use strict';

const hangmanImage = document.getElementById('hangmanImage');
const guessBtn = document.getElementById('guess');
const resetBtn = document.getElementById('newGame');
const input = document.getElementById('guessInput');
const wordInput = document.querySelector('.word');
const wordInputLabel = document.querySelector('label');
const inputGroup = document.querySelector('.input-group');
const lettersContainer = document.querySelector('.letters');
const lostScreen = document.getElementById('gameOver');
const statsBox = document.querySelector('.stats-box');
const statsElements = document.querySelectorAll('.stats-box > span > b');

let randomWord;

const game = {
    word: null,
    letters: null,
    gameOver: false,
    stage: 0,
    phase: 0,
    hits: 0,
    mistakes: 0,
    triedWords: [],

    endGame: function(result) {
        this.gameOver = true;

        if(result === 'lost') {
            this.letters.forEach((letter) => {
                letter.classList.remove("letter-hidden");
            });

            hangmanImage.classList.add("hangman-gameover");
            lostScreen.classList.add("gameOver--lost");
            lostScreen.textContent = "You lost :(";
        } else if(result === 'win') {
            hangmanImage.classList.add("hangman-gameover");
            lostScreen.classList.add("gameOver--win");
            lostScreen.textContent = "You won :)";
        }
        
        lostScreen.style.display = "flex";
        lostScreen.style.animation = "zoomIn .5s ease-in";
        input.style.display = 'none';
        guessBtn.style.display = 'none';
        statsBox.style.display = 'flex';

        this.endTime = performance.now();
        const timeDifference = Math.trunc((this.endTime - this.startTime) / 1000);
        const {stage, mistakes} = this;
        const [stageElement, mistakesElement, timeElement] = statsElements;
        stageElement.textContent = `${stage}/12`;
        mistakesElement.textContent = mistakes;
        timeElement.textContent = `${timeDifference} seconds`;
    },

    init: function() {
        game.word = null;
        game.stage = 0;
        game.mistakes = 0;
        game.gameOver = false;
        game.letters = null;
        game.phase = 0;
        game.triedWords = [];
        game.startTime = null;
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
        input.style.display = 'block';
        statsBox.style.display = 'none';
        lostScreen.style.display = 'none';
        input.value = '';
        inputGroup.style.display = 'block';
        guessBtn.style.display = 'block';
        guessBtn.textContent = 'Start';
        hangmanImage.style.display = 'none';
        wordInput.value = '';
        hangmanImage.classList.remove('hangman-gameover');
    } 
};

game.init();

document.addEventListener('keypress', function(e) {
    if(e.key === 'Enter') guessBtn.click();
});

guessBtn.addEventListener('click', () => {
    if(game.phase === 0) {
        if(!wordInput.value) {
            randomWord = [
              "inspection",
              "sympathy",
              "map",
              "driver",
              "resolution",
              "branch",
              "ample",
              "funeral",
              "level",
              "paint",
              "sausage",
              "sensitivity",
              "share",
              "disagreement",
              "strength",
              "core",
              "failure",
              "strap",
              "view",
              "genuine",
              "glove",
              "funny",
              "means",
              "treat",
              "year",
              "integrated",
              "strain",
              "realize",
              "domestic",
              "infinite",
              "twilight",
              "echo",
              "cave",
              "invisible",
              "space",
              "barrel",
              "shadow",
              "loud",
              "aloof",
              "simplicity",
              "reactor",
              "hospital",
              "reinforce",
              "moral",
              "game",
              "promote",
              "garbage",
              "operational",
              "plagiarize",
              "linen",
              "refund",
              "superior",
              "reproduction",
              "automatic",
            ];
            const randomNumber = Math.trunc(Math.random() * randomWord.length) + 1;
            game.word = randomWord[randomNumber];
        }
        if(!game.word) game.word = wordInput.value.toLowerCase();
        if(!game.gameOver && game.word) {
            game.startTime = performance.now();
            guessBtn.textContent = 'Guess';
            let str = "<div class='letter-group'>";
            game.word = [...game.word];
            inputGroup.style.display = 'none';
            hangmanImage.style.display = 'block';

            for(const letter of game.word) {
                str += letter === ' ' ? "</div><div class='letter-group'>" : `<span class='letter letter-hidden'>${letter}</span>`;
            }

            str += '</div>';
            lettersContainer.innerHTML = str;
            game.phase = 1;
        }
    } else if(game.phase === 1) {
        if(!game.gameOver) {
            const guess = input.value.toLowerCase();
            game.letters = document.querySelectorAll('.letter');
            if(game.word.includes(guess) && !game.triedWords.includes(guess)) {
                let i = 0;
                while(i < game.word.length) {
                    if(game.letters[i].textContent === guess) {
                        game.letters[i].classList.remove('letter-hidden');
                        game.hits++;
                    }
                    i++
                }
                game.triedWords.push(guess);
                if (game.hits === game.word.length) {
                  game.endGame('win');
                }
            } else {
                game.stage++;
                game.mistakes++;
                if(game.stage >= 12) {
                    game.endGame('lost');
                } else {
                    hangmanImage.src = `hangman-${game.stage}.jpg`;
                }
            }
            input.value = '';
        }
    }
});

resetBtn.addEventListener('click', game.init);
