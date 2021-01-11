'use strict';

const darkModeBtn = document.getElementById("darkModeBtn");
const body = document.querySelector('body');

const toggleDarkClass = el => {
    el.classList.toggle('dark');
};

darkModeBtn.addEventListener('click', () => {
    toggleDarkClass(body);
    body.classList.toggle('dark-bg');
    toggleDarkClass(document.getElementById('gameOver'));
    document.querySelectorAll('.stats > b').forEach(el => {
        toggleDarkClass(el);
    });
    darkModeBtn.textContent = body.classList.contains('dark') ? 'Dark mode: ON' : 'Dark mode: OFF';
});