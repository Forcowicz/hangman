'use strict';

const darkModeBtn = document.getElementById("dark-mode-btn");
const body = document.querySelector('body');

const toggleDarkClass = el => {
    el.classList.toggle('dark');
};

darkModeBtn.addEventListener('click', () => {
    toggleDarkClass(body);
    body.style.background = '#000';
    toggleDarkClass(document.querySelector(".gameOver"));
    document.querySelectorAll('.stats > b').forEach(el => {
        toggleDarkClass(el);
    });
    darkModeBtn.textContent = body.classList.contains('dark') ? 'Dark mode: ON' : 'Dark mode: OFF';
});