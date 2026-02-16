/**
 * Sharp Shooter - Main Initialization
 * First-person gallery shooter game
 */

// Get canvas and create game engine
const canvas = document.getElementById('gameCanvas');
const game = new SharpShooterEngine(canvas);

// UI Elements
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const gameOverScreen = document.getElementById('gameOver');

/**
 * Button Event Listeners (reused pattern)
 */
startBtn.addEventListener('click', () => {
    gameOverScreen.classList.add('hidden');
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    game.start();
});

pauseBtn.addEventListener('click', () => {
    game.togglePause();
    updatePauseButton();
});

restartBtn.addEventListener('click', () => {
    game.stop();
    gameOverScreen.classList.add('hidden');
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.textContent = 'Pause';
    game.reset();
});

playAgainBtn.addEventListener('click', () => {
    gameOverScreen.classList.add('hidden');
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    pauseBtn.textContent = 'Pause';
    game.start();
});

/**
 * Keyboard Controls
 */
document.addEventListener('keydown', (e) => {
    // Pause with Space or P
    if ((e.code === 'Space' || e.code === 'KeyP') && game.gameRunning) {
        game.togglePause();
        updatePauseButton();
        e.preventDefault();
    }
});

/**
 * Update pause button text
 */
function updatePauseButton() {
    pauseBtn.textContent = game.gamePaused ? 'Resume' : 'Pause';
}

/**
 * Initialize game display
 */
window.addEventListener('load', () => {
    game.draw();
    console.log('Sharp Shooter Game Loaded!');
    console.log('Tap or click enemies to shoot them!');
});
